
# rn_url_file_size

### Features

- Fetch file size from a URL without downloading the entire file
- Supports both HTTP and HTTPS protocols
- Follows redirects (configurable limit)
- Includes timeout for handling slow requests

## Installation

To install the package, run:

```bash
npm install rn_url_file_size
```
or

```bash
yarn add rn_url_file_size
```

## Example

```javascript
import rnufs from 'rn_url_file_size';

const getFileSize = async () => {
  try {
    const url = 'https://example.com/file.zip';
    const fileSizeInBytes = await rnufs(url);
    console.log(`File size: ${fileSizeInMB}`);
  } catch (error) {
    console.error('Error fetching file size:', error);
  }
};

getFileSize();
```
