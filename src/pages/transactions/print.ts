import type { Transaction } from "@/@types/transactions";
import { formatMoney } from "@/utils/format-money";
import { appConfig } from "@/config/meta";

export const printTransactionDetails = (transaction: Transaction): void => {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site to print.");
    return;
  }

  const isInflow = transaction.type === "inflow";

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const printContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Official Transaction Receipt - ${appConfig.fullName}</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Times New Roman", serif;
        color: #000;
        font-size: 14px;
        padding: 40px;
        position: relative;
      }

      /* Watermark */
      body::before {
        content: "${appConfig.fullName}";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        font-size: 60px;
        color: rgba(0, 0, 0, 0.05);
        z-index: 0;
        white-space: nowrap;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
      }

      .header h1 {
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .header p {
        font-size: 12px;
      }

      hr {
        border: 0;
        border-top: 1px solid #333;
        margin: 15px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        z-index: 1;
        position: relative;
      }

      td {
        padding: 6px 0;
        vertical-align: top;
      }

      .label {
        font-weight: bold;
        width: 30%;
      }

      .amount {
        font-weight: bold;
        color: ${isInflow ? "#065f46" : "#991b1b"};
      }

      .section-title {
        margin-top: 20px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 13px;
        border-bottom: 1px solid #999;
        padding-bottom: 3px;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        border-top: 1px solid #999;
        padding-top: 8px;
      }

      @media print {
        .no-print { display: none; }
        body { padding: 10mm; }
      }
    </style>
  </head>

  <body>
    <div class="header">
      <h1>Official Transaction Receipt</h1>
      <p>${appConfig.fullName}</p>
    </div>

    <hr />

    <table>
      <tr>
        <td class="label">Transaction ID:</td>
        <td>#${transaction.id}</td>
      </tr>
      <tr>
        <td class="label">Description:</td>
        <td>${transaction.description || "—"}</td>
      </tr>
      <tr>
        <td class="label">Transaction Type:</td>
        <td>${isInflow ? "INFLOW" : "OUTFLOW"}</td>
      </tr>
      <tr>
        <td class="label">Amount:</td>
        <td class="amount">${isInflow ? "+" : "-"}${formatMoney(transaction.amount)}</td>
      </tr>
      <tr>
        <td class="label">Date:</td>
        <td>${formatDate(transaction.created_at)}</td>
      </tr>
      <tr>
        <td class="label">Last Updated:</td>
        <td>${formatDate(transaction.updated_at)}</td>
      </tr>
    </table>

    ${transaction.transaction?.order_item
      ? `
      <div class="section-title">Related Order Details</div>
      <table>
        <tr>
          <td class="label">Order Item ID:</td>
          <td>#${transaction.transaction.order_item.id}</td>
        </tr>
        <tr>
          <td class="label">Description:</td>
          <td>${transaction.transaction.order_item.description || "—"}</td>
        </tr>
        <tr>
          <td class="label">Quantity:</td>
          <td>${transaction.transaction.order_item.quantity || "—"}</td>
        </tr>
        <tr>
          <td class="label">Subtotal:</td>
          <td>${formatMoney(transaction.transaction.order_item.sub_total)}</td>
        </tr>
      </table>
    `
      : ""
    }

    <div class="section-title">Staff Information</div>
    <table>
      <tr>
        <td class="label">Recorded By:</td>
        <td>${transaction.creator?.central_user?.name || "—"}</td>
      </tr>
      <tr>
        <td class="label">Updated By:</td>
        <td>${transaction.updater?.central_user?.name || "—"}</td>
      </tr>
    </table>

    <div class="footer">
      <p><strong>${appConfig.fullName}</strong> — Official Receipt</p>
      <p>Generated on ${formatDate(new Date().toISOString())}</p>
      <p>${appConfig.website}</p>
    </div>

    <div class="no-print" style="text-align:center; margin-top:15px;">
      <button onclick="window.print()" style="padding:6px 12px;">Print</button>
      <button onclick="window.close()" style="padding:6px 12px;">Close</button>
    </div>
  </body>
  </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();

  printWindow.onload = () => {
    setTimeout(() => printWindow.print(), 500);
  };
};
