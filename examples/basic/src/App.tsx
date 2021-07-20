import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  button,
  folder,
  Leva,
  LevaPanel,
  useControls,
  useCreateStore
} from 'leva';

import {useEventListener} from './useEventListener';
import create from 'zustand';
import {Portal} from '@radix-ui/react-portal';
import {createState, useStateDesigner} from 'state-designer';

let UUID_COUNT = 0;

interface ReactElement {
  element: HTMLElement;
  uuid: number;
  source: {
    filename: string;
    startLine: number;
    endLine: number;
  };
}

const machine = createState({
  initial: 'notSelected',
  data: {
    selected: null as null | ReactElement
  },
  on: {
    MOUSE_OUT: (data, payload) => {
      delete payload.element.dataset.hovering;
    },
    MOUSE_IN: (data, payload) => {
      payload.element.dataset.hovering = 'true';
      const {boxShadow} = window.getComputedStyle(payload.element);
      payload.element.style.setProperty(
        '--shadow',
        boxShadow === 'none' ? '0 0' : boxShadow
      );
    }
  },
  states: {
    selected: {
      on: {
        SELECT_ELEMENT: [
          (data, payload) => {
            const dataset = payload.element.dataset;
            data.selected = {
              element: payload.element,
              uuid: dataset.uuid,
              source: {
                filename: dataset.sourceFilename,
                startLine: dataset.sourceLineStart,
                endLine: dataset.sourceLineEnd
              }
            };
          },
          {to: 'selected'}
        ]
      }
    },
    notSelected: {
      on: {
        SELECT_ELEMENT: ['setSelectedElement', {to: 'selected'}]
      }
    }
  },
  actions: {
    setSelectedElement: (data, payload) => {
      const dataset = payload.element.dataset;
      data.selected = {
        element: payload.element,
        uuid: dataset.uuid,
        source: {
          filename: dataset.sourceFilename,
          startLine: dataset.sourceLineStart,
          endLine: dataset.sourceLineEnd
        }
      };
      data.selected = payload.element;
    }
  }
});

function useElementSelector({
  containerRef,
  onSelect,
  onPointerIn,
  onPointerOut
}: {
  containerRef: React.RefObject<HTMLElement>;
  onSelect: (element: HTMLElement) => void;
  onPointerIn: (element: HTMLElement) => void;
  onPointerOut: (element: HTMLElement) => void;
}) {
  const [selected, setState] = React.useState(null as null | any);

  useEventListener(
    'mouseover',
    (event) => {
      event.stopPropagation();
      if (!event.target) {
        return;
      }

      const element = event.target as HTMLElement;

      onPointerIn(element);
    },
    containerRef.current
  );

  useEventListener(
    'mouseout',
    (event) => {
      event.stopPropagation();

      if (!event.target) {
        return;
      }

      const element = event.target as HTMLElement;
      onPointerOut(element);
    },
    containerRef.current
  );

  useEventListener(
    'click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const previousElement: any = document.querySelector('[data-uuid]');
      if (previousElement) delete previousElement.dataset.uuid;

      if (!event.target) {
        return;
      }

      const element = event.target as HTMLElement;
      // Set uuid because state depends on it now
      const uuid = element.dataset.uuid ?? ++UUID_COUNT;
      element.dataset.uuid = uuid as string;
      setState({element: event.target, uuid});
      onSelect(event.target as HTMLElement);
    },
    containerRef.current,
    true
  );

  return selected;
}

const SelectedElement = ({selected}: {selected: ReactElement}) => {
  const [props, set] = useControls(
    () => ({
      [`Inspecting${selected.uuid}`]: folder({
        class: selected.element.className
      })
    }),
    [selected.uuid]
  );

  return null;
};

const Devtools = ({containerRef}: {containerRef: any}) => {
  const design = useStateDesigner(machine);

  const selectedElement = useElementSelector({
    containerRef,
    onSelect: (element) => {
      design.send('SELECT_ELEMENT', {element});
    },
    onPointerOut: (element) => {
      design.send('MOUSE_OUT', {element});
    },
    onPointerIn: (element) => {
      design.send('MOUSE_IN', {element});
    }
  });

  // Const [props, set] = useControls(() => ({
  //   Inspect: button(() => {
  //     alert('hello');
  //   })
  // }));

  console.log(selectedElement);

  return (
    <Portal>
      <Leva />
      {selectedElement && <SelectedElement selected={selectedElement} />}
    </Portal>
  );
};

const DevtoolsProvider = ({children}: React.PropsWithChildren<any>) => {
  const ref = React.useRef();

  return (
    <>
      <div ref={ref as any}>{children}</div>
      {/* <Devtools containerRef={ref} /> */}
    </>
  );
};

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <DevtoolsProvider>
      <div className="App bg-gradient-to-b from-green-500 to-blue-900">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="text-blue-100">Hello Vite +ads Re!</p>
          <p>
            <button
              type="button"
              onClick={() => {
                setCount((count) => count + 1);
              }}
            >
              count is: {count}
            </button>
          </p>
          <p>
            Edit <code>App.tsx</code> and saveest HMates.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              // Target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              // Target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </header>
      </div>
    </DevtoolsProvider>
  );
};

import routes from '@elders/pages';
// Import app from '@elders/app';
console.log(routes);
export default App;
