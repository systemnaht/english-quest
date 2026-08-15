export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({ok:false});
  try{
    const host=req.headers.host;
    const r=await fetch(`https://${host}/api/generate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({level:'B1+',weak:['Present Perfect','Past Simple'],grammar:{},length:5})});
    const text=await r.text();
    let data={}; try{data=JSON.parse(text)}catch{}
    return res.status(r.ok?200:500).json({ok:r.ok,status:r.status,count:Array.isArray(data.exercises)?data.exercises.length:0,model:data.model||null,error:data.error||null,message:data.message||null});
  }catch(e){return res.status(500).json({ok:false,error:String(e.message||e)})}
}
