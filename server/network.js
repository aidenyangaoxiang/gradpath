import https from 'node:https';
import dns from 'node:dns';
import ipaddr from 'ipaddr.js';

export function publicAddress(address) {
  try { let ip=ipaddr.parse(address); if(ip.kind()==='ipv6' && ip.isIPv4MappedAddress()) ip=ip.toIPv4Address(); return ip.range()==='unicast'; } catch { return false; }
}
export function validateUrl(value) {
  let url; try { url=new URL(value); } catch { throw new Error('请输入有效的 HTTPS 网址。'); }
  if(url.protocol!=='https:' || url.username || url.password || (url.port && url.port!=='443') || !url.hostname.includes('.') || (ipaddr.isValid(url.hostname.replace(/[\[\]]/g,'')) && !publicAddress(url.hostname.replace(/[\[\]]/g,'')))) throw new Error('只支持公开网站的 HTTPS 地址。');
  return url;
}
export function fetchPublic(value, depth=0) {
  const url=validateUrl(value);
  if(depth>4) throw new Error('网页重定向次数过多。');
  return new Promise((resolve,reject)=>{
    const req=https.get(url,{headers:{'User-Agent':'GradPath/0.1 (personal admissions research)','Accept':'text/html,application/rss+xml,application/json;q=0.8','Accept-Encoding':'identity'},lookup(host,options,cb){
      dns.lookup(host,{all:true},(err,addresses)=>{
        if(err) return cb(err);
        if(!addresses.length || addresses.some(a=>!publicAddress(a.address))) return cb(new Error('不能访问本地或保留网络地址。'));
        if(options.all) cb(null,addresses); else cb(null,addresses[0].address,addresses[0].family);
      });
    }},res=>{
      if(res.statusCode>=300 && res.statusCode<400 && res.headers.location){res.resume();resolve(fetchPublic(new URL(res.headers.location,url).href,depth+1));return;}
      if(res.statusCode!==200){res.resume();reject(new Error(`官网返回 ${res.statusCode}；可以粘贴网页正文手动导入。`));return;}
      const chunks=[]; let size=0;
      res.on('data',chunk=>{size+=chunk.length;if(size>3*1024*1024){res.destroy();reject(new Error('网页超过 3 MB，请粘贴相关正文。'));}else chunks.push(chunk);});
      res.on('end',()=>resolve({text:Buffer.concat(chunks).toString('utf8'),url:url.href,contentType:res.headers['content-type']||''}));
      res.on('error',reject);
    });
    const timer=setTimeout(()=>req.destroy(new Error('访问超时，请粘贴官网正文后重试。')),15000);
    req.on('close',()=>clearTimeout(timer));req.on('error',reject);
  });
}
