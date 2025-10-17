/* Global Jest + RTL setup for CRA.
   - Adds jest-dom matchers
   - Loads window API mocks used by components (speech, etc.)
*/
import '@testing-library/jest-dom';
import './testSetup/window_mocks';
