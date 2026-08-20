import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination, { getPaginationItems } from '../src/components/Pagination';

describe('getPaginationItems', () => {
  it('returns an empty array when there is one page or fewer', () => {
    expect(getPaginationItems(1, 1)).toEqual([]);
    expect(getPaginationItems(1, 0)).toEqual([]);
  });

  it('returns all pages with no ellipsis when the range is small', () => {
    expect(getPaginationItems(1, 4)).toEqual([1, 2, 3, 4]);
  });

  it('adds an ellipsis after the first page when current page is far from the start', () => {
    expect(getPaginationItems(6, 10)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 10]);
  });

  it('omits the leading ellipsis when current page is near the start', () => {
    expect(getPaginationItems(2, 10)).toEqual([1, 2, 3, 'ellipsis', 10]);
  });

  it('omits the trailing ellipsis when current page is near the end', () => {
    expect(getPaginationItems(9, 10)).toEqual([1, 'ellipsis', 8, 9, 10]);
  });
});

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('disables Previous on the first page and Next on the last page', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it('calls onPageChange with the clicked page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with page - 1 and page + 1 for Previous/Next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });
});
