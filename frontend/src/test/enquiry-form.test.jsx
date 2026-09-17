import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EnquiryFormPage from '../pages/customer/EnquiryFormPage.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('enquiry form rendering', () => {
  it('renders required fields and submit button', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter>
        <EnquiryFormPage />
      </MemoryRouter>
    );
    expect(getByText(/Full name/i)).toBeTruthy();
    expect(getByText('Business type *')).toBeTruthy();
    expect(getByRole('button', { name: /submit enquiry/i })).toBeTruthy();
  });
});
