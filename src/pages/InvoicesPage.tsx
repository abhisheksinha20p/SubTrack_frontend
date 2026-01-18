import { useEffect, useState } from 'react';
import { getInvoices } from '../lib/billingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

const statusVariant: Record<string, any> = {
  paid: 'success',
  pending: 'warning',
  failed: 'destructive',
  refunded: 'secondary',
  draft: 'secondary',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getInvoices().then(r => setInvoices(r.data?.invoices || []));
  }, []);

  const filtered = invoices.filter(inv =>
    (!filter || inv.invoiceNumber.includes(filter) || inv.dueDate?.includes(filter)) &&
    (!status || inv.status === status)
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <div className="mb-4 flex gap-2">
        <Input placeholder="Filter by number or date" value={filter} onChange={e => setFilter(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-2">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>Download PDFs and check payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Number</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">PDF</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv: any) => (
                  <tr key={inv.id} className="border-b hover:bg-secondary/30">
                    <td className="p-3">{inv.invoiceNumber}</td>
                    <td className="p-3">{inv.dueDate?.slice(0, 10)}</td>
                    <td className="p-3">{inv.total} {inv.currency}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant[inv.status] || 'secondary'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {inv.pdfUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
