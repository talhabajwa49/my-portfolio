exports.handler = async function (event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const params = JSON.parse(event.body);
    const action = params.action;

    let response = { status: 'error', message: 'Invalid action' };

    // Helper to format money
    const formatMoney = (amount) => '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (action === 'calculate_revenue') {
        const traffic = parseFloat(params.traffic || 0);
        const conversionRate = parseFloat(params.conversion_rate || 0) / 100;
        const aov = parseFloat(params.aov || 0);

        const revenue = traffic * conversionRate * aov;
        // SEO Impact: Assume 20% traffic increase
        const projectedRevenue = (traffic * 1.2) * conversionRate * aov;

        response = {
            status: 'success',
            data: {
                current_revenue: formatMoney(revenue),
                projected_revenue: formatMoney(projectedRevenue),
                potential_growth: formatMoney(projectedRevenue - revenue)
            }
        };
    } else if (action === 'calculate_traffic') {
        const currentTraffic = parseFloat(params.current_traffic || 0);
        const growthRate = parseFloat(params.growth_rate || 0) / 100;
        const months = parseInt(params.months || 12);

        const futureTraffic = currentTraffic * Math.pow((1 + growthRate), months);

        response = {
            status: 'success',
            data: {
                future_traffic: Math.round(futureTraffic).toLocaleString(),
                increase_percentage: (((futureTraffic - currentTraffic) / currentTraffic) * 100).toFixed(1) + '%'
            }
        };
    } else if (action === 'submit_contact') {
        // In a real function, you would send an email here using SendGrid/Postmark
        response = {
            status: 'success',
            message: 'Thank you! Your message has been received (Serverless Mock).'
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
};
