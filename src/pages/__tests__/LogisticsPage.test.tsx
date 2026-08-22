import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogisticsPage } from '../LogisticsPage';

const mockGetLogistics = vi.fn();

vi.mock('../../api/client', () => ({
  api: {
    getLogistics: (...args: unknown[]) => mockGetLogistics(...args),
  },
}));

function mockOverview() {
  return {
    generatedAt: '2026-08-04T12:00:00.000Z',
    systemHealth: 'healthy',
    kpis: {
      shipmentsToday: 312,
      deliveriesToday: 284,
      onTimeRate: 94.6,
      activeVehicles: 86,
      fleetSize: 92,
      activeDrivers: 89,
      inTransit: 47,
      delayed: 0,
      revenueToday: 2400,
      revenueMtd: 61200,
      mrr: 71750,
      currency: 'NGN',
    },
    deliveriesTrend: [{ day: '04 Aug', delivered: 284, in_transit: 47, delayed: 6 }],
    onTimeTrend: [{ day: '04 Aug', rate: 94.6 }],
    shipments: [
      {
        id: 'shp-01',
        trackingCode: 'PSL-4201',
        businessId: 'biz-riverside',
        businessName: 'Riverside Logistics',
        origin: 'Apapa, Lagos',
        destination: 'Ikeja, Lagos',
        status: 'delivered',
        driverName: 'Chidi Nwosu',
        vehiclePlate: 'LAG-8291 JK',
        weightKg: 1420,
        items: 24,
        revenue: 8400,
        currency: 'NGN',
        scheduledAt: '2026-08-04T07:00:00.000Z',
        deliveredAt: '2026-08-04T11:42:00.000Z',
      },
    ],
    vehicles: [
      { id: 'v1', plateNumber: 'LAG-8291 JK', model: 'Isuzu NPR 33', status: 'active', driverName: 'Chidi Nwosu', lastActiveAt: '2026-08-04T11:42:00.000Z' },
    ],
    routes: [
      { id: 'r1', name: 'Apapa → Ikeja', stops: 6, distanceKm: 28, activeDeliveries: 14 },
    ],
  };
}

beforeEach(() => {
  mockGetLogistics.mockReset();
});

describe('LogisticsPage', () => {
  it('renders the page title and header badge', async () => {
    mockGetLogistics.mockResolvedValue(mockOverview());
    render(<LogisticsPage />);

    expect(screen.getByText('Logistics')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });
  });

  it('renders KPI values from the API', async () => {
    mockGetLogistics.mockResolvedValue(mockOverview());
    render(<LogisticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Shipments Today')).toBeInTheDocument();
      expect(screen.getByText('312')).toBeInTheDocument();
      expect(screen.getByText('On-time Rate')).toBeInTheDocument();
    });
  });

  it('renders recent shipments from the API', async () => {
    mockGetLogistics.mockResolvedValue(mockOverview());
    render(<LogisticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Recent shipments')).toBeInTheDocument();
      expect(screen.getByText('PSL-4201')).toBeInTheDocument();
      expect(screen.getByText('Riverside Logistics')).toBeInTheDocument();
    });
  });

  it('falls back to mock data when the API call fails', async () => {
    mockGetLogistics.mockRejectedValue(new Error('down'));
    render(<LogisticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Recent shipments')).toBeInTheDocument();
    });
    expect(screen.getByText('PSL-4202')).toBeInTheDocument();
  });
});
