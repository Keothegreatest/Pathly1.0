'use client';
import {Check} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
export function SuccessMark(){return <span className="plan-success-mark" aria-hidden="true"><Check size={26}/></span>}
export type Milestone={id:string;title:string;detail:string};
export function MilestoneDialog({milestone,onClose}:{milestone:Milestone;onClose:()=>void}){return <Dialog open onOpenChange={v=>{if(!v)onClose()}}><DialogContent className="milestone-dialog"><SuccessMark/><DialogTitle>{milestone.title}</DialogTitle><DialogDescription>{milestone.detail}</DialogDescription><button className="primary" onClick={onClose}>Continue</button></DialogContent></Dialog>}
