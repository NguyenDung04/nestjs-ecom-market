import { Category } from 'src/modules/categories/entities/category.entity';

export type CategoryTreeItem = Category & {
  children: CategoryTreeItem[];
};

export function buildCategoryTree(categories: Category[]): CategoryTreeItem[] {
  const categoryMap = new Map<number, CategoryTreeItem>();
  const tree: CategoryTreeItem[] = [];

  for (const category of categories) {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  }

  for (const category of categoryMap.values()) {
    if (category.parentId && categoryMap.has(category.parentId)) {
      categoryMap.get(category.parentId)!.children.push(category);
    } else {
      tree.push(category);
    }
  }

  return tree;
}
