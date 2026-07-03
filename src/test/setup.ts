/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';
import { installMockFetch } from '../api/mockFetch';

installMockFetch();
