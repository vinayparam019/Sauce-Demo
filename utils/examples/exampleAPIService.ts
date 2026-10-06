import { APIClient } from '../../core/api/client';
import { assertSchema, isRecord } from '../../core/utils/schema';

export interface DashboardShortcutsResponse {
  data: Record<string, boolean>;
  meta: unknown[];
  rels: unknown[];
}

export interface EmployeeLocation {
  location: { id: number; name: string };
  count: number;
}

export interface EmployeeLocationsResponse {
  data: EmployeeLocation[];
  meta: {
    otherEmployeeCount: number;
    unassignedEmployeeCount: number;
    totalLocationCount: number;
  };
  rels: unknown[];
}

const isDashboardShortcutsResponse = (value: unknown): value is DashboardShortcutsResponse =>
  isRecord(value) &&
  isRecord(value.data) &&
  Object.values(value.data).every((enabled) => typeof enabled === 'boolean') &&
  Array.isArray(value.meta) &&
  Array.isArray(value.rels);

const isEmployeeLocation = (value: unknown): value is EmployeeLocation =>
  isRecord(value) &&
  isRecord(value.location) &&
  typeof value.location.id === 'number' &&
  typeof value.location.name === 'string' &&
  typeof value.count === 'number';

const isEmployeeLocationsResponse = (value: unknown): value is EmployeeLocationsResponse =>
  isRecord(value) &&
  Array.isArray(value.data) &&
  value.data.every(isEmployeeLocation) &&
  isRecord(value.meta) &&
  Array.isArray(value.rels);


export class ExampleAPIService {
  constructor(private readonly client: APIClient) {}

  async getDashboardShortcuts(): Promise<DashboardShortcutsResponse> {
    const response = await this.client.get<unknown>('/web/index.php/api/v2/dashboard/shortcuts');
    return assertSchema(response, isDashboardShortcutsResponse, 'OrangeHRM dashboard shortcuts');
  }

  async getEmployeeLocations(): Promise<EmployeeLocationsResponse> {
    const response = await this.client.get<unknown>(
      '/web/index.php/api/v2/dashboard/employees/locations',
    );
    return assertSchema(response, isEmployeeLocationsResponse, 'OrangeHRM employee locations');
  }
}
