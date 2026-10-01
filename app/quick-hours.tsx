'use client';
import {useRef,useState} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Entry} from './model';

import {hoursUpdate} from './experience-hours';
export function QuickHours({entry,onClose,onSave}:{entry:Entry;onClose:()=>void;onSave:(e:Entry)=>Promise<void>}){
 const [value,setValue]=useState(''),[error,setError]=useState('');const submitted=useRef(false);
 return <Dialog open onOpenChange={open=>{if(!open)onClose()}}><DialogContent><DialogTitle>Log hours</DialogTitle><DialogDescription>{entry.data.title} · {entry.data.hours||'0'} hours already recorded. Add only hours you have not logged before.</DialogDescription><form onSubmit={event=>{event.preventDefault();if(submitted.current)return;const update=hoursUpdate(entry,value);if(!update){setError('Enter a positive number of hours.');return;}submitted.current=true;void onSave(update).catch(()=>{});onClose();}}><label className="field"><span>Hours to add</span><input autoFocus type="number" inputMode="decimal" min="0.01" step="0.01" required value={value} onChange={e=>setValue(e.target.value)}/></label><p className="form-hint">Your experience total and linked hours goals update together. You can capture a reflection when something meaningful happens.</p>{error&&<p role="alert" className="error">{error}</p>}<div className="form-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Save hours</button></div></form></DialogContent></Dialog>;
}
