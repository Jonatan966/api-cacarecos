import { ReactNode } from 'react'
import { v4 } from 'uuid'

import collapserStyles from '../styles/components/collapser.module.scss'

interface CollapserProps {
  children: ReactNode;
  containerClassname?: string;
  headerClassname?: string;
  headerChildren?: ReactNode;
}

export function Collapser ({
  children,
  containerClassname,
  headerClassname,
  headerChildren
}: CollapserProps) {
  const itemID = v4()

  return (
    <>
      <input
        type="checkbox"
        hidden
        id={`toggle-${itemID}`}
        className={collapserStyles.collapserToggle}
      />

      <label 
        className={`${headerClassname} ${collapserStyles.collapserHeader}`} 
        htmlFor={`toggle-${itemID}`}
      >
        {headerChildren}
      </label>

      <div className={`${containerClassname} ${collapserStyles.collapserContainer}`}>
        { children }
      </div>
    </>
  )
}
