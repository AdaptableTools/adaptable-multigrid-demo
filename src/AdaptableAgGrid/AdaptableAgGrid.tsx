import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useMemo } from 'react';
import { GridOptions } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';
import { columnDefs, defaultColDef } from './columnDefs';
import { Car, rowData } from './rowData';
import { agGridModules } from './agGridModules';

const renderWeakMap: WeakMap<HTMLElement, Root> = new WeakMap();

export interface AdaptableAgGridProps {
  instanceIndex: number;
  headerBackground: string;
}
export const AdaptableAgGrid = (props: AdaptableAgGridProps) => {
  const gridOptions = useMemo<GridOptions<Car>>(
    () => ({
      defaultColDef,
      columnDefs,
      sideBar: true,

      suppressMenuHide: true,
      enableRangeSelection: true,
      enableCharts: true,
    }),
    [],
  );
  const adaptableOptions = useMemo<AdaptableOptions<Car>>(
    () => ({
      licenseKey: import.meta.env.VITE_ADAPTABLE_LICENSE_KEY,
      primaryKey: 'id',
      userName: 'Test User',
      adaptableId: `Adaptable-${props.instanceIndex}`,
      predefinedConfig: {
        Dashboard: {
          Tabs: [
            {
              Name: 'Welcome',
              Toolbars: ['Layout'],
            },
          ],
        },
        CalculatedColumn: {
          CalculatedColumns: [
            {
              ColumnId: '2price',
              CalculatedColumnSettings: {
                DataType: 'Number',
              },
              Query: {
                ScalarExpression: '2 * [price]',
              },
            },
          ],
        },
        Layout: {
          CurrentLayout: 'FirstLayout',
          Layouts: [
            {
              Name: 'First Layout',
              Columns: ['make', 'model', 'price', '2price', 'date'],
            },
            {
              Name: 'Second Layout',
              Columns: ['make', 'model', 'price', '2price', 'date'],
            },
          ],
        },
      },
    }),
    [],
  );

  const adaptableApiRef = React.useRef<AdaptableApi>();

  return (
    <div
      className={'flex h-full flex-col'}
      style={
        {
          height: '500px',
          width: '100%',
          display: 'flex',
          flexFlow: 'column',
          '--ab-dashboard-header__background': props.headerBackground,
        } as React.CSSProperties
      }
    >
      <AdaptableReact
        className={'flex-none'}
        gridOptions={gridOptions}
        adaptableOptions={adaptableOptions}
        renderReactRoot={(node, container) => {
          let root = renderWeakMap.get(container);
          if (!root) {
            renderWeakMap.set(container, (root = createRoot(container)));
          }
          root.render(node);
          return () => {
            root?.unmount();
          };
        }}
        onAdaptableReady={({ adaptableApi }) => {
          // save a reference to adaptable api
          adaptableApiRef.current = adaptableApi;
          adaptableApi.gridApi.setGridData(rowData);
        }}
      />
      <div className="ag-theme-alpine flex-1">
        <AgGridReact gridOptions={gridOptions} modules={agGridModules} />
      </div>
    </div>
  );
};
