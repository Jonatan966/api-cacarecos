INSERT INTO permissions(name)
VALUES('BUY'),('ADD_RATING'),('REMOVE_RATING'),('ADD_PRODUCT')
,('VIEW_PRODUCT_UNITS'),('LIST_USERS'),('SHOW_USER'),('EDIT_PRODUCT')
,('VIEW_ORDERS'),('FINISH_ORDER'),('ADD_CATEGORY')
,('REMOVE_CATEGORY'),('REMOVE_PRODUCT'),('REMOVE_USER')
,('ADD_PERMISSION'),('LIST_PERMISSIONS')
,('REMOVE_PERMISSION'),('ADD_ROLE'),('EDIT_ROLE')
,('REMOVE_ROLE'),('VIEW_ROLES'),('UPDATE_ORDER'),('UPDATE_USER')
,('ADD_STOCK'),('LIST_STOCKS'),('FAVORITE')
,('ADD_NEWS'),('EDIT_NEWS'),('REMOVE_NEWS'),('LIST_NEWS')
ON CONFLICT DO NOTHING;

INSERT INTO roles(name)
VALUES('USER'),('EMPLOYER'),('ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions
  SELECT roles.id, permissions.id 
  FROM roles, permissions 
  WHERE roles.name = 'USER'
  AND (
    permissions.name = 'BUY' OR
    permissions.name = 'ADD_RATING' OR
    permissions.name = 'REMOVE_RATING' OR
    permissions.name = 'FAVORITE'
  )
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions
  SELECT roles.id, permissions.id 
  FROM roles, permissions 
  WHERE roles.name = 'EMPLOYER'
  AND (
    permissions.name = 'ADD_PRODUCT' OR
    permissions.name = 'LIST_USERS' OR
    permissions.name = 'SHOW_USER' OR
    permissions.name = 'EDIT_PRODUCT' OR
    permissions.name = 'VIEW_ORDERS' OR
    permissions.name = 'FINISH_ORDER' OR
    permissions.name = 'ADD_STOCK' OR
    permissions.name = 'UPDATE_ORDER' OR
    permissions.name = 'LIST_STOCKS' OR
    permissions.name = 'LIST_NEWS'
  )
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions
  SELECT roles.id, permissions.id 
  FROM roles, permissions 
  WHERE roles.name = 'ADMIN'
  AND (
    permissions.name = 'ADD_CATEGORY' OR
    permissions.name = 'REMOVE_CATEGORY' OR 
    permissions.name = 'REMOVE_PRODUCT' OR
    permissions.name = 'REMOVE_USER' OR
    permissions.name = 'ADD_PERMISSION' OR
    permissions.name = 'LIST_PERMISSIONS' OR
    permissions.name = 'REMOVE_PERMISSION' OR
    permissions.name = 'ADD_ROLE' OR
    permissions.name = 'EDIT_ROLE' OR
    permissions.name = 'REMOVE_ROLE' OR
    permissions.name = 'VIEW_ROLES' OR
    permissions.name = 'UPDATE_ORDER' OR
    permissions.name = 'UPDATE_USER' OR
    permissions.name = 'ADD_NEWS' OR
    permissions.name = 'EDIT_NEWS' OR
    permissions.name = 'REMOVE_NEWS'
  )
ON CONFLICT DO NOTHING;
