import generate from './generate.js';

export default async function handler(req,res){
  req.method='POST';
  req.body={
    profile:{level:'B1+',estimatedLevel:'B1+'},
    weakTenses:['Present Simple','Present Continuous'],
    length:5,
    mode:'adaptive',
    curriculumAllowed:['Present Simple','Present Continuous'],
    curriculumLesson:{
      title:'Present Simple ↔ Present Continuous',
      core:'Present Simple for routines/facts; Present Continuous for now/temporary situations.',
      trap:'Stative verbs are usually not continuous.'
    }
  };
  return generate(req,res);
}
