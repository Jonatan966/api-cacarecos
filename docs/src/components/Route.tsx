import styles from '../styles/components/route.module.scss'
import { CodeBlock } from './CodeBlock'
import { Collapser } from './Collapser'

interface RouteProps {
  method: string;
  path: string;
  objective: string;
  responseExample?: any;
  requestExample?: any;
  requireAuth?: boolean;
  searchParams?: any;
  permissions?: string[];
}

export function Route ({
  method,
  path,
  objective,
  responseExample,
  requestExample,
  searchParams,
  permissions
}: RouteProps) {
  return (
    <div className={styles.routeItem}>
      <Collapser
        headerClassname={styles.routeHeader}
        headerChildren={
          <>
            <h1>{method}</h1>
            <h3>{path}</h3>
            <img src='/icons/down.svg' alt='Seta' />
          </>
        }
      >
        <div className={styles.routeDetails}>
          <div className={`${styles.routeResume} ${!permissions && styles.fullWidth}`}>
            <h1>Objetivo</h1>
            <p>{objective}</p>
          </div>

          {permissions && (
            <div className={styles.accessPermissions}>
              <h1><span title='Requer autenticação'>🔑</span> Permissões necessárias</h1>
              {permissions.map((permission, permissionKey) => 
                <strong key={permissionKey}> 
                  {permission} 
                </strong>
              )}
            </div>
          )}

          {searchParams && (
            <div className={styles.routeRequestExample}>
              <h1>Parâmetros de pesquisa (query params)</h1>
              <CodeBlock code={searchParams}/>
            </div>          
          )}

          {requestExample && (
            <div className={styles.routeRequestExample}>
              <h1>Requisição</h1>
              <CodeBlock code={requestExample}/>
            </div>
          )}

          {responseExample && (
            <div className={`${styles.routeResponseExample} ${((!searchParams && !requestExample)) && styles.fullWidth}`}>
              <h1>Resposta</h1>
              <CodeBlock code={responseExample}/>
            </div>
          )}
        </div>
      </Collapser>
    </div>
  )
}
