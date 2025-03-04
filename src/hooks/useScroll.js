import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import Uptop from '../components/DaengFinder/Uptop';

/**
 * 
 * @param {RefObject} targetElementId  element id that can be storage name
 * @param {Boolean} isScroll  true or false
 * @param {String} storageName storage name
 * @param {String[]} dependOn  useEffect dependency array
 * 
 */
const useScroll = (targetRef, isScroll, storageName,...dependOn) => {
  const [checkScrollTop, setCheckScrollTop] = useState(0)
  useEffect(()=>{
    /**
     * @description data 의존성 배열값에 따라서 targetRef가 존재할 수도 있고 undefined일수도 있어서 useEffect 안에 있어야 함.
     */
    const scroller = targetRef.current;
    if(!isScroll){
      // sessionStorage.setItem(storageName, 0)
      sessionStorage.removeItem(storageName)
    }
    const currentScrollY = Number(
      JSON.parse(sessionStorage.getItem(storageName)),
    );
    if(currentScrollY) scroller?.scrollTo(0, currentScrollY);
    
    const saveScrollTop = debounce(() => {
      const scrollYRecord = JSON.stringify(scroller?.scrollTop);
      setCheckScrollTop(Number(scroller?.scrollTop))
      sessionStorage.setItem(storageName, scrollYRecord);
    }, 200);
    
    scroller?.addEventListener('scroll', saveScrollTop)
    
    return () => {
      scroller?.removeEventListener('scroll', saveScrollTop);
    };
  }, dependOn);

  /**
   * 
   * @param {Boolean} useScrollTop 
   * @returns 
   */
  const ScrollTopComponent = ({useScrollTop}) => <Uptop useScrollTop={useScrollTop} checkScrollTop={checkScrollTop} scroller={targetRef}/>;

  return [ScrollTopComponent]
}

export default useScroll