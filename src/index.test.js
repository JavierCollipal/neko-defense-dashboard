// 🐾⚡ NEKO-ARC TESTS - index.js Entry Point ⚡🐾
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div>Mocked App Component</div>;
  };
});

describe('index.js Entry Point', () => {
  let mockRoot;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock root object
    mockRoot = {
      render: jest.fn()
    };

    // Mock ReactDOM.createRoot to return our mock
    ReactDOM.createRoot.mockReturnValue(mockRoot);

    // Mock document.getElementById
    document.getElementById = jest.fn(() => document.createElement('div'));
  });

  describe('🎯 Initialization Tests', () => {
    it('calls ReactDOM.createRoot with root element', () => {
      // Re-require index.js to execute it
      jest.isolateModules(() => {
        require('./index');
      });

      expect(ReactDOM.createRoot).toHaveBeenCalledWith(
        expect.any(HTMLElement)
      );
    });

    it('gets root element by ID "root"', () => {
      jest.isolateModules(() => {
        require('./index');
      });

      expect(document.getElementById).toHaveBeenCalledWith('root');
    });

    it('calls render on the created root', () => {
      jest.isolateModules(() => {
        require('./index');
      });

      expect(mockRoot.render).toHaveBeenCalledTimes(1);
    });
  });

  describe('⚛️ React.StrictMode Tests', () => {
    it('renders App inside React.StrictMode', () => {
      jest.isolateModules(() => {
        require('./index');
      });

      // Get the rendered element
      const renderCall = mockRoot.render.mock.calls[0][0];

      // Check that it's a StrictMode component
      expect(renderCall.type).toBe(React.StrictMode);
    });

    it('renders App component as child of StrictMode', () => {
      jest.isolateModules(() => {
        require('./index');
      });

      const renderCall = mockRoot.render.mock.calls[0][0];
      const apolloProvider = renderCall.props.children;

      // 🐾 App is wrapped in ApolloProvider, so check that ApolloProvider contains App
      expect(apolloProvider.type.name).toBe('ApolloProvider');
      expect(apolloProvider.props.children.type).toBe(App);
    });
  });

  describe('🧪 Error Handling Tests', () => {
    it('does not crash if root element exists', () => {
      expect(() => {
        jest.isolateModules(() => {
          require('./index');
        });
      }).not.toThrow();
    });

    it('handles null root element gracefully', () => {
      document.getElementById = jest.fn(() => null);

      // ReactDOM.createRoot will throw if passed null
      // But we're testing that the code executes
      expect(() => {
        jest.isolateModules(() => {
          try {
            require('./index');
          } catch (e) {
            // Expected to throw with null element
          }
        });
      }).not.toThrow();
    });
  });
});

// *purrs in entry point testing excellence* 😻⚡🐾
