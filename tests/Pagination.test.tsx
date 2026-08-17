import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination, { getPaginationItems } from '../src/components/Pagination';

describe('getPaginationItems', () => {
  it('returns nothing for a single page', () => {
    expect(getPaginationItems(1, 1)).toEqual([]);
  });

  it('shows every page when there are few of them', () => {
    expect(getPaginationItems(1, 3)).toEqual([1, 2, 3]);
    expect(getPaginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('windows around the current page with ellipses for large page counts', () => {
    expect(getPaginationItems(1, 20)).toEqual([1, 2, 'ellipsis', 20]);
    expect(getPaginationItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    expect(getPaginationItems(20, 20)).toEqual([1, 'ellipsis', 19, 20]);
  });
});

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('marks the current page and disables the edge buttons appropriately', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it('calls onPageChange with the target page when a page number is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Page 3'));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with page - 1 / page + 1 for Previous/Next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
