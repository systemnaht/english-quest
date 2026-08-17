export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true,ai:Boolean(process.env.AI_GATEWAY_API_KEY),app:'StormSpeak'});
}
