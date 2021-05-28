import { ReactNode } from 'react'

import styles from '../styles/components/route-stack.module.scss'
import { Collapser } from './Collapser'

interface RouteGroupProps {
  children: ReactNode;
  title: string;
}

export function RouteGroup ({ children, title }: RouteGroupProps) {
  return (
    <article className={styles.routeGroup}>
      <Collapser
        containerClassname={styles.groupContainer}
        headerClassname={styles.groupHeader}
        headerChildren={
          <>
            <h1>{title}</h1>
            <img src='/icons/down.svg' alt='Seta' />
          </>
        }
      >
        { children }
      </Collapser>
    </article>
  )
}
