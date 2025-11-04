# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


***TIME ZONE IN SQL
The Problem: Ambiguous Timezone Conversion
The fundamental issue boiled down to how the date was stored in your database versus how MySQL was instructed to perform the comparison, leading to an off-by-one day error whenever the UTC time stored was late in the day (e.g., 10 PM).

Here is the breakdown of the failure:

Stored Data Format: Your itemadded column stored the book entry time as a UTC timestamp, like: 2025-09-29T22:00:00.000Z (10 PM UTC).

MySQL's Default Behavior: When MySQL processes a DATETIME or TIMESTAMP column that is stored in UTC, and you use simple functions like DATE(p.itemadded) for filtering, it often attempts to convert that time into the MySQL server's local timezone before extracting the date.

The Shift: If your MySQL server was configured to a local timezone that is UTC+3 (for example), the stored UTC time of 2025-09-29 22:00:00 would be converted to the local time of 2025-09-30 01:00:00.

When the database then runs DATE(), it extracts the date: 2025-09-30.

Since your query parameter was asking for 2025-09-29, the records did not match, and the result was zero.

The Solution (CONVERT_TZ):
The final working solution explicitly told MySQL to ignore the local server time and treat the stored value as a true UTC date before comparison:

SQL

DATE(CONVERT_TZ(p.itemadded, @@session.time_zone, '+00:00')) = ?
This sequence ensured:

Normalization: The CONVERT_TZ function took the timestamp value and explicitly converted it to the UTC timezone (+00:00).

Accurate Extraction: The DATE() function then extracted the date from this correctly normalized UTC time, reliably producing 2025-09-29, which matched your query parameter.

In short, the problem was a hidden timezone-dependent date extraction within MySQL, which was corrected by forcing the calculation to occur in a universally standard timezone (UTC).