import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const AnalyticsCharts = ({ attempts, quizzes }) => {
  // Prepare data for charts
  const prepareScoreDistributionData = () => {
    const ranges = [
      { range: '90-100%', min: 90, max: 100, color: '#22c55e' },
      { range: '70-89%', min: 70, max: 89, color: '#3b82f6' },
      { range: '50-69%', min: 50, max: 69, color: '#f59e0b' },
      { range: '0-49%', min: 0, max: 49, color: '#ef4444' }
    ];

    return ranges.map(({ range, min, max, color }) => ({
      range,
      count: attempts.filter(a => (a.percentage || 0) >= min && (a.percentage || 0) <= max).length,
      color
    }));
  };

  const prepareQuizPerformanceData = () => {
    return quizzes.slice(0, 6).map(quiz => {
      const quizAttempts = attempts.filter(a => a.quizId === quiz.id);
      const avgScore = quizAttempts.length > 0 
        ? Math.round(quizAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / quizAttempts.length)
        : 0;
      
      return {
        name: quiz.title.length > 15 ? quiz.title.substring(0, 15) + '...' : quiz.title,
        score: avgScore,
        attempts: quizAttempts.length
      };
    });
  };

  const prepareTimeSeriesData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttempts = attempts.filter(a => {
        const attemptDate = a.dateTaken?.toDate ? a.dateTaken.toDate() : new Date(a.dateTaken);
        return attemptDate.toISOString().split('T')[0] === dateStr;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        attempts: dayAttempts.length,
        avgScore: dayAttempts.length > 0 
          ? Math.round(dayAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / dayAttempts.length)
          : 0
      });
    }
    return last7Days;
  };

  const scoreDistributionData = prepareScoreDistributionData();
  const quizPerformanceData = prepareQuizPerformanceData();
  const timeSeriesData = prepareTimeSeriesData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Score Distribution Chart */}
      <div className="analytics-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {scoreDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quiz Performance Chart */}
      <div className="analytics-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Timeline */}
      <div className="analytics-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="attempts" 
              stroke="#334155" 
              fill="#334155" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="avgScore" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Pie Chart */}
      <div className="analytics-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={scoreDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
            >
              {scoreDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4 space-x-4">
          {scoreDistributionData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
