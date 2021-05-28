import { ReactNode } from 'react'
import styles from '../styles/components/route-stack.module.scss'

interface RouteStackProps {
  children?: ReactNode;
}

export function RouteStack ({ children }: RouteStackProps) {
  return (
    <section className={styles.routeStack}>
      {children}
    </section>
  )
}
