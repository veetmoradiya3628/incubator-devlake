import { describe, expect, it } from 'vitest';

import { mergeRemoteSearchPage } from './search-remote';

describe('mergeRemoteSearchPage', () => {
  it('resets the visible results on a new search query', () => {
    const prev = {
      items: [{ id: 1, type: 'scope', title: 'Old result' }],
      currentItems: [{ id: 1, type: 'scope', title: 'Old result' }],
    };

    const next = mergeRemoteSearchPage({
      previousItems: prev.items,
      previousCurrentItems: prev.currentItems,
      newItems: [{ id: 2, type: 'scope', title: 'New result' }],
      page: 1,
      pageSize: 50,
      total: 1,
    });

    expect(next.items).toEqual([{ id: 2, type: 'scope', title: 'New result' }]);
    expect(next.currentItems).toEqual([{ id: 2, type: 'scope', title: 'New result' }]);
    expect(next.hasMore).toBe(false);
  });

  it('appends later pages without dropping earlier matches', () => {
    const next = mergeRemoteSearchPage({
      previousItems: [{ id: 1, type: 'scope', title: 'First page' }],
      previousCurrentItems: [{ id: 1, type: 'scope', title: 'First page' }],
      newItems: [{ id: 2, type: 'scope', title: 'Second page' }],
      page: 2,
      pageSize: 50,
      total: 101,
    });

    expect(next.items).toEqual([
      { id: 1, type: 'scope', title: 'First page' },
      { id: 2, type: 'scope', title: 'Second page' },
    ]);
    expect(next.currentItems).toEqual([
      { id: 1, type: 'scope', title: 'First page' },
      { id: 2, type: 'scope', title: 'Second page' },
    ]);
    expect(next.hasMore).toBe(true);
  });
});
