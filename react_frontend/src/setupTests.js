/* Global Jest + RTL setup for CRA.
   - Adds jest-dom matchers
   - Loads window API mocks used by components (speech, etc.)
*/
import '@testing-library/jest-dom';
import './__tests__/test_setup_window_mocks';
