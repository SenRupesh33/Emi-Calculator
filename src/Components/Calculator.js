import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

function Calculator() {
  const [userValues, setUserValues] = useState({
    amount: '',
    interest: '',
    years: '',
  });

  const [results, setResults] = useState({
    monthlyPayment: '',
    totalPayment: '',
    totalInterest: '',
    isResult: false,
  });

  const [isMonthlyInterest, setIsMonthlyInterest] = useState(false);

  const [error, setError] = useState('');

  const [chartData, setChartData] = useState(null);

  const handleInputChange = (event) =>
    setUserValues({ ...userValues, [event.target.name]: event.target.value });

  const isValid = () => {
    const { amount, interest, years } = userValues;
    let actualError = '';

    if (!amount || !interest || !years) {
      actualError = 'All the values are required';
    }

    if (isNaN(amount) || isNaN(interest) || isNaN(years)) {
      actualError = 'All the values must be a valid number';
    }

    if (Number(amount) <= 0 || Number(interest) <= 0 || Number(years) <= 0) {
      actualError = 'All the values must be a positive number';
    }

    if (actualError) {
      setError(actualError);
      return false;
    }

    return true;
  };

  const handleSubmitValues = (e) => {
    e.preventDefault();
    if (isValid()) {
      setError('');
      calculateResults(userValues);
    }
  };

  const calculateResults = ({ amount, interest, years }) => {
    const userAmount = Number(amount);
    const calculatedInterest = isMonthlyInterest
      ? Number(interest) / 100 / 12 // Monthly interest calculation
      : Number(interest) / 100; // Annual interest calculation

    const calculatedPayments = Number(years) * 12;
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (userAmount * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      const monthlyPaymentCalculated = monthly.toFixed(2);
      const totalPaymentCalculated = (monthly * calculatedPayments).toFixed(2);
      const totalInterestCalculated = (
        monthly * calculatedPayments -
        userAmount
      ).toFixed(2);

      setResults({
        monthlyPayment: monthlyPaymentCalculated,
        totalPayment: totalPaymentCalculated,
        totalInterest: totalInterestCalculated,
        isResult: true,
      });

      const chartData = {
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            label: 'Loan Payment Distribution',
            data: [userAmount, monthly * calculatedPayments - userAmount],
            backgroundColor: ['#ff6384', '#36a2eb'],
            hoverBackgroundColor: ['#ff6384', '#36a2eb'],
          },
        ],
      };

      setChartData(chartData);
    }
    return;
  };

  const clearFields = () => {
    setUserValues({
      amount: '',
      interest: '',
      years: '',
    });

    setResults({
      monthlyPayment: '',
      totalPayment: '',
      totalInterest: '',
      isResult: false,
    });

    setChartData(null);
  };

  const toggleInterestType = () => {
    setIsMonthlyInterest((prevState) => !prevState);
    setResults({
      monthlyPayment: '',
      totalPayment: '',
      totalInterest: '',
      isResult: false,
    });
    setChartData(null);
  };

  return (
    <div className="calculator">
      <div className="form">
        <h1>Loan EMI Calculator</h1>
        <p className="error">{error}</p>
        <form onSubmit={handleSubmitValues}>
          <div className="form-items">
            <div>
              <label id="label">Amount:</label>
              <input
                type="text"
                name="amount"
                placeholder="Loan amount"
                value={userValues.amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label id="label">Interest:</label>
              <input
                type="text"
                name="interest"
                placeholder="Interest"
                value={userValues.interest}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label id="label">Years:</label>
              <input
                type="text"
                name="years"
                placeholder="Years to repay"
                value={userValues.years}
                onChange={handleInputChange}
              />
            </div>
            <input type="submit" className="button" />
            <button type="button" className="button" onClick={toggleInterestType}>
              {isMonthlyInterest ? 'Annual Interest' : 'Monthly Interest'}
            </button>
          </div>
        </form>
        {results.isResult && (
          <div className="form-items">
            <h4>
              Loan amount: ₹{userValues.amount} <br />
              Interest: {userValues.interest}% <br />
              Years to repay: {userValues.years}
            </h4>
            <div>
              <label id="label">Monthly Payment:</label>
              <input type="text" value={results.monthlyPayment} disabled />
            </div>
            <div>
              <label id="label">Total Payment: </label>
              <input type="text" value={results.totalPayment} disabled />
            </div>
            <div>
              <label id="label">Total Interest:</label>
              <input type="text" value={results.totalInterest} disabled />
            </div>
            <input
              className="button"
              value="Calculate again"
              type="button"
              onClick={clearFields}
            />
          </div>
        )}
      </div>
      <div>
        <h2 className='payment-h1'>Payment Breakup</h2>
        <div>
      {chartData && (
        <div className="chart" >
          <Pie data={chartData} />
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

export default Calculator;
