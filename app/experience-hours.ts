import type {Entry} from './model';
export function hoursUpdate(entry:Entry,value:string):Entry|null{
 const added=Number(value),current=Number(entry.data.hours||0);
 if(!value.trim()||!Number.isFinite(added)||added<=0||!Number.isFinite(current)||current<0||!Number.isFinite(current+added))return null;
 return {...entry,data:{...entry.data,hours:String(Math.round((current+added)*100)/100)}};
}
