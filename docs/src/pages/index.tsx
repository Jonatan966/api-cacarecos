import { Header } from '../components/Header'
import { Route } from '../components/Route'
import { RouteGroup } from '../components/RouteGroup'
import { RouteStack } from '../components/RouteStack'
import { Title } from '../components/Title'

import styles from '../styles/pages/default-page-container.module.scss'

import data from '../data/routes.json'

const IndexPage = () => (
  <>
    <Header/>
    <main className={styles.defaultPageContainer}>
      <Title/>

      <RouteStack>
        {data.map((routeGroup, groupKey) =>
          <RouteGroup title={routeGroup.name} key={groupKey}>
            {routeGroup.routes.map((route: any, routeKey: number) => 
              <Route {...route} key={routeKey}/>
            )}
          </RouteGroup>
        )}
      </RouteStack>
    </main>
  </>
)

export default IndexPage
