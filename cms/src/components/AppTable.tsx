import { styled } from "styled-components";
import { Table, TableProps } from "antd";

interface PropTypes<T> extends TableProps<T> {}

const AppTable = <T extends object>(props: PropTypes<T>) => {
  const CustomTable = styled(Table<T>)`
    .ant-table-thead > tr > th {
      background-color: rgba(229, 229, 229, 1);
      border-radius: 0;
    }

    .ant-table-tbody > tr.striped-row {
      background-color: rgba(229, 229, 229, 1);
      border-radius: 0;
    }

    .ant-table-tbody > tr > td {
      border-bottom: none;
    }

    .ant-table {
      border: none;
      border-radius: 0 !important;
    }
  `;
  return (
    <CustomTable
      {...props}
      //   rowClassName={(_, index) => (index % 2 === 0 ? "" : "striped-row")}
    />
  );
};

export default AppTable;

//   <StyledTableWrapper>
//           <Table
//             key={"carFeatureId"}
//             columns={column}
//             dataSource={data}
//             pagination={false}
//             loading={isLoading}
//             rowClassName={(_, index) => (index % 2 === 0 ? "" : "striped-row")}
//           />
//         </StyledTableWrapper>

// const StyledTableWrapper = styled.div``;
