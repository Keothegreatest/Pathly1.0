import os from 'node:os';
import {syncBuiltinESMExports} from 'node:module';
const original=os.userInfo;os.userInfo=(options)=>{try{return original(options)}catch{return {uid:-1,gid:-1,username:process.env.USERNAME||'codex',homedir:os.homedir(),shell:null}}};syncBuiltinESMExports();
