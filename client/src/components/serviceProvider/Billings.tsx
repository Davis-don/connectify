import React from 'react';
import './billings.css';

const Billings: React.FC = () => {
  const invoices = [
    {
      id: 'INV-2024-001',
      date: 'Jan 15, 2024',
      client: 'John Smith',
      amount: '$450',
      status: 'Paid',
      type: 'Service Payment'
    },
    {
      id: 'INV-2024-002',
      date: 'Jan 20, 2024',
      client: 'Sarah Johnson',
      amount: '$320',
      status: 'Pending',
      type: 'Installation'
    },
    {
      id: 'INV-2024-003',
      date: 'Feb 05, 2024',
      client: 'Mike Wilson',
      amount: '$780',
      status: 'Paid',
      type: 'Repair Service'
    },
    {
      id: 'INV-2024-004',
      date: 'Feb 12, 2024',
      client: 'Emily Davis',
      amount: '$540',
      status: 'Overdue',
      type: 'Maintenance'
    }
  ];

  const payments = [
    {
      id: 'PAY-001',
      date: 'Jan 16, 2024',
      amount: '$450',
      method: 'Credit Card',
      status: 'Completed'
    },
    {
      id: 'PAY-002',
      date: 'Feb 06, 2024',
      amount: '$780',
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 'PAY-003',
      date: 'Feb 15, 2024',
      amount: '$540',
      method: 'PayPal',
      status: 'Processing'
    }
  ];

  return (
    <div className="svp-billings-container">
      <h1 className="svp-billings-title">Billings</h1>
      
      <div className="svp-billings-summary">
        <div className="svp-summary-card">
          <div className="svp-summary-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="svp-summary-content">
            <h3>Total Revenue</h3>
            <p>$12,850</p>
            <span className="svp-summary-trend positive">+18%</span>
          </div>
        </div>
        
        <div className="svp-summary-card">
          <div className="svp-summary-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="svp-summary-content">
            <h3>Pending Payments</h3>
            <p>$860</p>
            <span className="svp-summary-trend neutral">3 invoices</span>
          </div>
        </div>
        
        <div className="svp-summary-card">
          <div className="svp-summary-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="svp-summary-content">
            <h3>This Month</h3>
            <p>$2,150</p>
            <span className="svp-summary-trend positive">+12%</span>
          </div>
        </div>
      </div>

      <div className="svp-billings-content">
        <div className="svp-invoices-section">
          <div className="svp-section-header">
            <h2>Recent Invoices</h2>
            <button className="svp-create-invoice-btn">
              <i className="fas fa-plus"></i>
              Create Invoice
            </button>
          </div>
          
          <div className="svp-invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="svp-invoice-id">
                        <i className="fas fa-file-invoice"></i>
                        {invoice.id}
                      </div>
                    </td>
                    <td>{invoice.date}</td>
                    <td>{invoice.client}</td>
                    <td className="svp-amount">{invoice.amount}</td>
                    <td>
                      <span className={`svp-status-badge ${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <div className="svp-invoice-actions">
                        <button className="svp-action-btn view">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="svp-action-btn download">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="svp-payments-section">
          <h2>Payment History</h2>
          <div className="svp-payments-list">
            {payments.map((payment) => (
              <div key={payment.id} className="svp-payment-item">
                <div className="svp-payment-info">
                  <div className="svp-payment-id">
                    <i className="fas fa-receipt"></i>
                    {payment.id}
                  </div>
                  <div className="svp-payment-date">{payment.date}</div>
                </div>
                <div className="svp-payment-details">
                  <div className="svp-payment-amount">{payment.amount}</div>
                  <div className="svp-payment-method">
                    <i className={`fas fa-${payment.method === 'Credit Card' ? 'credit-card' : 'university'}`}></i>
                    {payment.method}
                  </div>
                  <span className={`svp-payment-status ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billings;