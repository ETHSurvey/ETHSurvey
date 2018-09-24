import * as Containers from '../views/containers';

export const routes = [
  {
    component: Containers.HomeContainer,
    exact: true,
    path: '/'
  },
  {
    component: Containers.CreateContainer,
    path: '/create'
  }
];
