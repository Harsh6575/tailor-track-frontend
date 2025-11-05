import type { Customer, Measurements } from "@/types";
import { formatDate } from "./format-date";
import { t, translations } from "./constants/translation";

export const printMeasurement = (customer: Customer, measurement: Measurements) => {
  const printContent = `
    <html>
      <head>
        <title>${customer.fullName} - ${measurement.type} Measurement</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }

          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .container {
            padding: 16px 24px;
            flex: 1;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            margin-bottom: 16px;
            padding-bottom: 4px;
          }

          .header h1 {
            margin: 0;
            font-size: 22px;
          }

          .data {
            background: #f8f8f8;
            border-radius: 8px;
            padding: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 14px;
          }

          table td {
            border: 1px solid #ccc;
            padding: 4px 8px;
          }

          .notes {
            margin-top: 12px;
            font-style: italic;
            color: #555;
          }

          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 12px;
          }

          .capitalize {
            text-transform: capitalize;
          }


          /* Prevent extra blank page */
          @media print {
            body {
              page-break-after: avoid;
            }
            .container {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${customer.fullName}</h1>
            <p class="capitalize">${measurement.type} Measurement Sheet</p>
          </div>

          <div class="data">
            <table>
              ${Object.entries(measurement.data)
                .map(
                  ([key, value]) => `<tr><td>${t(key as keyof (typeof translations)["en"], "en")}
                                ${" (" + t(key as keyof (typeof translations)["en"], "gu") + ")"}</td><td>${value}</td></tr>`
                )
                .join("")}
            </table>
          </div>

          ${
            measurement.notes
              ? `<div class="notes"><strong>${t("notes", "en")}
                ${" (" + t("notes", "gu") + ")"}
              </strong> : ${measurement.notes}</div>`
              : ""
          }

          <div class="footer">
            Tailor Track — Generated on ${formatDate(new Date())}
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return alert("Popup blocked. Please allow popups for this site.");

  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to render fully before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};
