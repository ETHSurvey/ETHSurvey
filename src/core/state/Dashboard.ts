interface Survey {
  name: string;
  totalResponses: string;
}

export interface DashboardState {
  surveys: Survey[];
}
