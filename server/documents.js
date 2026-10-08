import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
export const extensions=['.pdf','.docx','.txt','.png','.jpg','.jpeg'];
export async function parseDocument(buffer,name) {
  const ext=path.extname(name).toLowerCase(); let text='',pages=null,error=null;
  if(!extensions.includes(ext))throw new Error('支持 PDF、DOCX、TXT、PNG、JPG，单个文件不超过 15 MB。');
  try {
    if(ext==='.pdf'){
      if(buffer.subarray(0,5).toString()!=='%PDF-')throw new Error('PDF 文件头无效');
      const parser=new PDFParse({data:new Uint8Array(buffer)});
      try {const parsed=await parser.getText();text=parsed.pages.map(p=>p.text).join('\n');pages=parsed.total;} finally {await parser.destroy();}
    } else if(ext==='.docx') {if(buffer.subarray(0,2).toString()!=='PK')throw new Error('DOCX 文件头无效');text=(await mammoth.extractRawText({buffer})).value;}
    else if(ext==='.txt') {text=new TextDecoder('utf-8',{fatal:true}).decode(buffer);if(text.includes('\0'))throw new Error('不是有效的文本文件');}
    else {error='图片已保存，暂未启用 OCR，请人工核对内容。';}
  } catch { error='文件已保存，但文字解析失败。请检查文件是否损坏、加密或为扫描件。'; }
  text=text.slice(0,200000);
  if(!error && text.trim().length<80) error='可提取文字较少，可能是空白文档或扫描件，请人工核对。';
  return {text,pages,words:(text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)||[]).length,parseError:error,extension:ext};
}
