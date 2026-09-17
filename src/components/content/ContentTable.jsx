export default function ContentTable({ children, ...tableProps }) {
  return (
    <div className="content-table-scroll">
      <table {...tableProps}>{children}</table>
    </div>
  );
}
