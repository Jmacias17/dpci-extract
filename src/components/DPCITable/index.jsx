// DPCITable.jsx
// Displays a table of extracted DPCI results, grouped by image page number.
// Each row shows extraction status and any matched DPCIs per image.
//
// Props:
// - images: array of image objects with `pageNumber`
// - dpciResults: array of { page: number, dpciList: string[] }
// - processingStatus: object keyed by page number, tracks loading and progress

import React from 'react';
import { Spinner, Table } from 'react-bootstrap';

/**
 * Displays a status badge depending on the extraction state for each page.
 * @param {Object} status - Contains loading and progress info
 * @param {string[]} dpciList - List of matched DPCIs
 * @returns JSX element with status icon/text
 */
const getStatusElement = (status, dpciList) => {
  if (status?.loading) {
    return (
      <>
        <Spinner animation="border" size="sm" /> {status.progress}%
      </>
    );
  }

  if (dpciList?.length > 0) {
    return <span className="text-success">✅ Done</span>;
  }

  return <span className="text-muted">❌ No Matches</span>;
};

/**
 * Renders the DPCI results in a responsive Bootstrap table.
 */
const DPCITable = ({ images, dpciResults, processingStatus }) => {
  return (
    <Table
      responsive
      bordered
      className="mt-3 table-sm align-middle text-start"
      variant="light"
    >
      <thead className="table-dark">
        <tr>
          <th style={{ width: '10%' }}>Page</th>
          <th style={{ width: '20%' }}>Status</th>
          <th>DPCI(s)</th>
        </tr>
      </thead>
      <tbody>
        {images.map((img) => {
          const page = img.pageNumber;
          const status = processingStatus[page];
          const result = dpciResults.find((r) => r.page === page);
          const dpciList = result?.dpciList || [];

          // If still processing or no matches found
          if (status?.loading || dpciList.length === 0) {
            return (
              <tr key={`page-${page}`}>
                <td><strong>{page}</strong></td>
                <td>{getStatusElement(status, dpciList)}</td>
                <td>{status?.loading ? '—' : 'No DPCI found'}</td>
              </tr>
            );
          }

          // If multiple DPCIs found, span the page & status across rows
          return dpciList.map((dpci, i) => (
            <tr key={`page-${page}-dpci-${i}`}>
              {i === 0 && (
                <>
                  <td rowSpan={dpciList.length}><strong>{page}</strong></td>
                  <td rowSpan={dpciList.length}>{getStatusElement(status, dpciList)}</td>
                </>
              )}
              <td>{dpci}</td>
            </tr>
          ));
        })}
      </tbody>
    </Table>
  );
};

export default DPCITable;
