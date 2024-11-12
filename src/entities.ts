export type TreeEntry = {
  type: "blob" | "tree";
  hash: string; // SHA-1 hash of blob or tree
  name: string; // file or directory name
};

export type TreeObject = {
  entries: TreeEntry[];
};

export type FileEntry = {
  name: string;
  hash: string;
};

export type DirectoryGroup = {
  [directory: string]: FileEntry[];
};

export type DirectoryGroupWithDepth = {
  depth: number;
  path: string;
  files: FileEntry[];
};

export type CommitObject = {
  treeHash: string;
  parent: string | null;
  author: string;
  timestamp: string;
  message: string;
};
