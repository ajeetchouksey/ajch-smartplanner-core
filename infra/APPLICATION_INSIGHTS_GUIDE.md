# Application Insights Setup Guide

This document describes the Application Insights monitoring setup for SmartPlanner.

## 🔍 **What's Configured**

### **Application Insights Resource**
- **Name**: `appi-smartplanner-{environment}`
- **Type**: Web application monitoring
- **Workspace**: Connected to Log Analytics workspace
- **Retention**: 30-90 days (environment-dependent)
- **Sampling**: 50-100% (cost-optimized)

### **Azure Functions Integration**
- **Auto-instrumentation**: Enabled via app settings
- **Runtime telemetry**: Node.js performance tracking
- **Custom logging**: Available via `context.log()`
- **Dependency tracking**: Automatic for HTTP, Database calls

### **Monitoring Features**

#### **Automatic Telemetry**
✅ HTTP requests and responses  
✅ Function execution duration  
✅ Dependencies (Cosmos DB, Key Vault, Storage)  
✅ Exceptions and errors  
✅ Performance counters  
✅ Custom events and metrics  

#### **Built-in Dashboards**
✅ Request rate and response times  
✅ Failure rate analysis  
✅ Performance trends  
✅ User flow analytics  
✅ Live metrics stream  

#### **Alerting Rules**
✅ **High failure rate**: > 5 HTTP 5xx errors in 5 minutes  
✅ **Slow response time**: > 5 seconds average response time  
✅ **Custom alerts**: Can be added via Azure Portal  

## 📊 **Accessing Monitoring Data**

### **Azure Portal**
1. Navigate to **Application Insights** resource
2. Use **Live Metrics** for real-time monitoring
3. Check **Failures** tab for error analysis
4. View **Performance** for response time trends

### **Workbook Dashboard**
- Custom monitoring dashboard with key metrics
- Request rate, response time, and exception tracking
- KQL queries for detailed analysis

### **Log Analytics Queries**
```kusto
// Recent requests
requests
| where timestamp > ago(1h)
| summarize count() by resultCode
| order by count_ desc

// Slow requests
requests
| where duration > 1000  // > 1 second
| project timestamp, name, duration, resultCode
| order by timestamp desc

// Exception analysis
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage
| order by count_ desc
```

## ⚙️ **Configuration Settings**

### **Environment Variables (Functions)**
```javascript
const appInsights = require('applicationinsights');

// Auto-configured via environment variables:
// APPINSIGHTS_INSTRUMENTATIONKEY
// APPLICATIONINSIGHTS_CONNECTION_STRING

// Manual initialization (if needed)
appInsights.setup().start();
```

### **Custom Telemetry**
```javascript
const { app } = require('@azure/functions');

app.http('myFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        // Custom metrics
        context.log('Processing request', { 
            userId: request.query.userId,
            operation: 'data-processing'
        });
        
        // Track custom events
        const appInsights = require('applicationinsights');
        appInsights.defaultClient.trackEvent({
            name: 'UserAction',
            properties: {
                action: 'plan-created',
                userId: request.query.userId
            }
        });
        
        return { status: 200, body: 'Success' };
    }
});
```

## 🎯 **Key Metrics to Monitor**

### **Performance Metrics**
- **Response Time**: Keep < 3 seconds for good UX
- **Throughput**: Monitor requests per second
- **Availability**: Target 99.9% uptime
- **Error Rate**: Keep < 1% of total requests

### **Business Metrics**
- **User Activities**: Plan creation, completion rates
- **Feature Usage**: Most used features and workflows
- **API Endpoints**: Most called functions and performance
- **Geographic Distribution**: User locations and performance

### **Cost Metrics**
- **Data Ingestion**: Monitor monthly data volume
- **Retention Costs**: Balance retention vs. cost
- **Alert Frequency**: Optimize alert thresholds

## 🔧 **Development Integration**

### **Local Development**
```bash
# Set local Application Insights key (optional)
export APPINSIGHTS_INSTRUMENTATIONKEY="your-key-here"

# Or disable for local development
export APPINSIGHTS_INSTRUMENTATIONKEY=""
```

### **Environment Configuration**
- **Development**: Monitoring disabled or minimal
- **Staging**: Full monitoring with short retention
- **Production**: Full monitoring with extended retention

### **CI/CD Integration**
```yaml
# GitHub Actions example
- name: Deploy with monitoring
  env:
    APPINSIGHTS_INSTRUMENTATIONKEY: ${{ secrets.APPINSIGHTS_KEY }}
  run: |
    # Deploy functions with Application Insights enabled
    terraform apply -auto-approve
```

## 🚨 **Alerting Setup**

### **Critical Alerts**
1. **Function Failures**: Immediate alert on 5+ failures
2. **High Response Time**: Alert when average > 5 seconds
3. **No Data**: Alert if no telemetry received for 15 minutes

### **Warning Alerts**
1. **Elevated Error Rate**: Alert when error rate > 2%
2. **Resource Usage**: Alert at 80% of service limits
3. **Cost Threshold**: Alert at 80% of monthly budget

### **Notification Channels**
- **Email**: Development team alerts
- **Slack/Teams**: Integration possible
- **SMS**: For critical production issues
- **Azure Mobile App**: Real-time notifications

## 📈 **Performance Optimization**

### **Sampling Configuration**
- **Development**: 50% sampling to reduce noise
- **Production**: 100% sampling for complete visibility
- **Cost Control**: Adjust sampling based on data volume

### **Custom Dashboards**
1. **Executive Dashboard**: High-level KPIs and trends
2. **Developer Dashboard**: Detailed performance metrics
3. **Operations Dashboard**: System health and alerts

### **Data Retention**
- **Free Tier**: 90 days included
- **Extended Retention**: Pay for longer retention if needed
- **Export Options**: Export to Storage for long-term analysis

## 🔍 **Troubleshooting**

### **Common Issues**
1. **No Data**: Check instrumentation key configuration
2. **Partial Data**: Verify all app settings are configured
3. **High Costs**: Review sampling and retention settings
4. **Missing Dependencies**: Ensure auto-instrumentation is enabled

### **Debugging Steps**
1. Check Application Insights resource in Azure Portal
2. Verify Functions app environment variables
3. Review Live Metrics for real-time data flow
4. Check Log Analytics workspace connection

### **Support Resources**
- [Application Insights Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Azure Functions Monitoring](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring)
- [KQL Query Language](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/)

---

## 🎯 **Next Steps**

1. **Deploy Infrastructure**: Run `terraform apply` to create resources
2. **Verify Configuration**: Check that telemetry data appears in portal
3. **Set Up Alerts**: Configure notification channels
4. **Create Dashboards**: Build custom monitoring views
5. **Train Team**: Ensure everyone knows how to use monitoring tools

The Application Insights setup provides comprehensive monitoring while maintaining cost optimization through free tier usage and intelligent sampling.
