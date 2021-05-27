import styles from '../styles/components/header.module.scss'

export function Header () {
  return (
    <header className={styles.appHeader}>
      <nav className={styles.headerContent}>
        <h1>Cacarecos - API</h1>

        <a className='item-hover' href='https://github.com/Jonatan966/api-cacarecos'>
          <img src='/icons/github.svg' alt='Github' />
          Visitar repositório
        </a>
      </nav>
    </header>
  )
}
