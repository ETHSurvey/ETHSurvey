import * as Containers from '../views/containers';

export const routes = [
  {
    component: Containers.HomeContainer,
    exact: true,
    path: '/'
  },
  {
    component: Containers.CreateSurveyContainer,
    path: '/create'
  },
  {
    component: Containers.TakeSurveyContainer,
    path: '/s/:id'
  },
  {
    component: Containers.ViewSurveysContainer,
    path: '/view'
  }
];
