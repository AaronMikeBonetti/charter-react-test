import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [rewardPoints, setRewardPoints] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        { customer: "Customer 1", amount: 120, date: "2023-08-01" },
        { customer: "Customer 2", amount: 75, date: "2023-08-01" },
        { customer: "Customer 1", amount: 50, date: "2023-09-01" },
        { customer: "Customer 2", amount: 150, date: "2023-09-01" },
        { customer: "Customer 1", amount: 60, date: "2023-10-01" },
        { customer: "Customer 2", amount: 90, date: "2023-10-01" },
      ];

      setTransactions(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const calculateRewardPoints = () => {
      const pointsByCustomer = {};

      transactions.forEach((transaction) => {
        const { customer, amount, date } = transaction;
        const transactionDate = new Date(date);
        const month = transactionDate.getMonth() + 1;

        const pointsOver100 = Math.max(0, amount - 100) * 2;
        const pointsOver50 = Math.min(50, amount - 50);
        const totalPoints = pointsOver100 + pointsOver50;

        if (!pointsByCustomer[customer]) {
          pointsByCustomer[customer] = {
            [month]: { points: totalPoints, amountSpent: amount },
          };
        } else {
          if (!pointsByCustomer[customer][month]) {
            pointsByCustomer[customer][month] = {
              points: totalPoints,
              amountSpent: amount,
            };
          } else {
            pointsByCustomer[customer][month].points += totalPoints;
            pointsByCustomer[customer][month].amountSpent += amount;
          }
        }
      });

      setRewardPoints(pointsByCustomer);
    };

    calculateRewardPoints();
  }, [transactions]);

  const currentMonth = new Date().getMonth();
  const monthHeaders = Array.from({ length: 3 }, (_, i) => {
    const month = (currentMonth - i) % 12;
    return new Date(2023, month).toLocaleString("default", { month: "long" });
  });

  return (
    <div className="app">
      <h1>Reward Points Calculator</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                {monthHeaders.reverse().map((month, index) => (
                  <th key={index}>{month}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(rewardPoints).map((customer) => (
                <tr key={customer}>
                  <td>{customer}</td>
                  {monthHeaders
                    .map((month, index) => (
                      <td key={index}>
                        {`Spent: $${
                          rewardPoints[customer][currentMonth - index]
                            .amountSpent
                        } | Points: ${
                          rewardPoints[customer][currentMonth - index].points
                        }`}
                      </td>
                    ))
                    .reverse()}
                  <td>
                    Spent: $
                    {Object.values(rewardPoints[customer]).reduce(
                      (total, entry) => total + entry.amountSpent,
                      0
                    )}{" "}
                     | Points:
                    {Object.values(rewardPoints[customer]).reduce(
                      (total, entry) => total + entry.points,
                      0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
