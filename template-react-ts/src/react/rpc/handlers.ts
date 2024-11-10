export interface SelectionType {
  id: string;
  name: string;
  type: string;
}

export async function handleSelectionChange(selection: SelectionType[]) {
  console.log('selection change', selection);
}

const codeHandlers = {
  handleSelectionChange,
};

type CodeHandlers = typeof codeHandlers;

export { CodeHandlers, codeHandlers };
