import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Plus, Upload, Folder, Table2 } from 'lucide-react';
import { useState } from "react";

const PowerBIInterface = () => {
//   const [selectedWorkspace, setSelectedWorkspace] = useState('');
//   const [selectedDataset, setSelectedDataset] = useState('');
//   const [selectedTables, setSelectedTables] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newTemplateSQL, setNewTemplateSQL] = useState('');

  // const currentTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const currentTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }).replace(',', '');

  // Define a type for schema templates
  type SchemaTemplates = {
    [key: string]: string;
  };

  // Sample schema previews for existing templates
  const schemaTemplates: SchemaTemplates = {
    'template1': `-- Default Schema Template
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    last_modified DATETIME,
    created_by VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

CREATE TABLE OrderDetails (
    detail_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT CHECK (quantity > 0),
    unit_price DECIMAL(10,2),
    discount DECIMAL(4,2) DEFAULT 0.00,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Audit trigger
CREATE TRIGGER tr_Orders_Update
ON Orders
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Orders
    SET last_modified = CURRENT_TIMESTAMP
    FROM Orders o
    INNER JOIN inserted i ON o.order_id = i.order_id;
END;`,
    'template2': `-- Custom Schema 1 - Analytics Focus
CREATE TABLE CustomerAnalytics (
    analytics_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    segment_id INT,
    total_lifetime_value DECIMAL(15,2),
    first_purchase_date DATE,
    last_purchase_date DATE,
    purchase_frequency DECIMAL(5,2),
    avg_order_value DECIMAL(10,2),
    preferred_category VARCHAR(50),
    churn_risk_score DECIMAL(3,2),
    last_engagement_date DATETIME,
    engagement_score INT CHECK (engagement_score BETWEEN 0 AND 100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    source_system VARCHAR(50),
    CONSTRAINT FK_CustomerAnalytics_Customer FOREIGN KEY (customer_id)
        REFERENCES Customers(id)
);

-- Materialized View for Quick Analytics
CREATE VIEW vw_CustomerInsights WITH SCHEMABINDING AS
SELECT 
    c.analytics_id,
    c.customer_id,
    c.segment_id,
    c.total_lifetime_value,
    DATEDIFF(day, c.first_purchase_date, CURRENT_TIMESTAMP) as customer_age_days,
    c.purchase_frequency,
    c.churn_risk_score
FROM dbo.CustomerAnalytics c
WHERE c.churn_risk_score > 0.5;`
  };

  // Sample data for demonstration
  const transferHistory = [
    {
      id: 1,
      timestamp: "2024-03-20 14:30:00",
      workspace: "Sales Analytics",
      dataset: "Q1 2024 Sales",
      tables: ["Orders", "Customers"],
      status: "Completed"
    },
    {
      id: 2,
      timestamp: "2024-03-19 09:15:00",
      workspace: "Marketing Insights",
      dataset: "Campaign Results 2024",
      tables: ["Campaigns", "Interactions", "Conversions"],
      status: "Completed"
    },
    {
      id: 3,
      timestamp: "2024-03-18 16:45:00",
      workspace: "Finance Reports",
      dataset: "Monthly Financial Stats",
      tables: ["Revenue", "Expenses"],
      status: "Failed"
    },
    {
      id: 4,
      timestamp: "2024-03-17 11:20:00",
      workspace: "HR Analytics",
      dataset: "Employee Performance",
      tables: ["Employees", "Performance", "Attendance"],
      status: "Completed"
    },
    {
      id: 5,
      timestamp: "2024-03-16 13:10:00",
      workspace: "Product Analytics",
      dataset: "Product Usage Metrics",
      tables: ["Products", "Usage", "Feedback"],
      status: "Completed"
    },
    {
      id: 6,
      timestamp: "2024-03-15 10:30:00",
      workspace: "Customer Service",
      dataset: "Support Tickets Q1",
      tables: ["Tickets", "Responses", "Satisfaction"],
      status: "In Progress"
    },
    {
      id: 7,
      timestamp: "2024-03-14 15:25:00",
      workspace: "Sales Analytics",
      dataset: "Regional Sales Data",
      tables: ["RegionalSales", "Territories"],
      status: "Completed"
    },
    {
      id: 8,
      timestamp: "2024-03-13 09:45:00",
      workspace: "Marketing Insights",
      dataset: "Social Media Metrics",
      tables: ["SocialPosts", "Engagement", "Reach"],
      status: "Completed"
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            PowerBI Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#F3F4F6]">
              <TabsTrigger value="transfer">Data Transfer</TabsTrigger>
              <TabsTrigger value="history">Transfer History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transfer" className="space-y-6">
              {/* Workspace and Dataset Selection */}
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Folder className="h-4 w-4 inline mr-2" />
                    Choose Workspace
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select a workspace...</option>
                    <option value="ws1">Sales Analytics</option>
                    <option value="ws2">Marketing Insights</option>
                    <option value="ws3">Finance Reports</option>
                    <option value="ws4">HR Analytics</option>
                    <option value="ws5">Product Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Database className="h-4 w-4 inline mr-2" />
                    Select Dataset
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Choose a dataset...</option>
                    <option value="ds1">Q1 2024 Sales</option>
                    <option value="ds2">Campaign Results 2024</option>
                    <option value="ds3">Monthly Financial Stats</option>
                    <option value="ds4">Employee Performance</option>
                    <option value="ds5">Product Usage Metrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Table2 className="h-4 w-4 inline mr-2" />
                    Select Tables
                  </label>
                  <div className="border rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {['Orders', 'Customers', 'Products', 'Transactions', 'Inventory', 'Suppliers', 'Categories', 'Employees'].map(table => (
                        <label key={table} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>{table}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schema Template Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Schema Template</label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 p-2 border rounded-md"
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="">Select existing template...</option>
                      <option value="template1">Default Schema</option>
                      <option value="template2">Custom Schema 1</option>
                    </select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" /> New Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Schema Template</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input placeholder="Template Name" />
                          <textarea 
                            className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                            placeholder="Enter SQL schema..."
                            value={newTemplateSQL}
                            onChange={(e) => setNewTemplateSQL(e.target.value)}
                          />
                          <Button className="w-full">Save Template</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Schema Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2">Schema Preview</label>
                  <div className="border rounded-md p-3 bg-gray-50 h-96 overflow-auto font-mono text-sm">
                    {selectedTemplate ? (
                      <pre className="whitespace-pre-wrap">
                        {schemaTemplates[selectedTemplate]}
                      </pre>
                    ) : (
                      <div className="text-gray-500 text-center mt-16">
                        Select a template to preview schema
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Timestamp</label>
                  <div className="text-sm text-gray-600 mb-4">
                    {currentTimestamp} (automatically added to schema)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input 
                    type="text" 
                    placeholder="Enter tags (comma-separated)"
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Transfer to SQL
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Workspace</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Dataset</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Tables</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transferHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">{item.timestamp}</td>
                        <td className="px-4 py-3 text-sm">{item.workspace}</td>
                        <td className="px-4 py-3 text-sm">{item.dataset}</td>
                        <td className="px-4 py-3 text-sm">{item.tables.join(", ")}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerBIInterface;



