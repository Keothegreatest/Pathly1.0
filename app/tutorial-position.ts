type Rect = {left:number;right:number;top:number;bottom:number};

/** DialogContent portals to body, so center within the measured content region.
 * Its left boundary comes from the rendered sidebar (the shared 16rem token),
 * not a duplicated sidebar width or a step-specific target offset.
 */
export function tutorialPosition(viewport:{width:number;height:number}, sidebarRight:number|null, target:Rect|null, measuredHeight:number) {
  const margin=sidebarRight!==null?32:16,gap=24;
  const regionLeft=sidebarRight??0;
  const regionWidth=Math.max(0,viewport.width-regionLeft);
  const width=Math.max(0,Math.min(460,regionWidth-margin*2));
  const maxHeight=Math.max(0,viewport.height-margin*2);
  const height=Math.min(measuredHeight,maxHeight);
  if(sidebarRight!==null){
    return {left:regionLeft+(regionWidth-width)/2,top:(viewport.height-height)/2,width,maxHeight};
  }
  // Mobile points to the page-context label; the callout stays below that target.
  const safeTop=target?Math.max(margin,target.bottom+gap):margin;
  const availableHeight=viewport.height-safeTop-margin;
  return {left:(viewport.width-width)/2,top:Math.max(safeTop,(viewport.height-Math.min(height,availableHeight))/2),width,maxHeight:availableHeight};
}
