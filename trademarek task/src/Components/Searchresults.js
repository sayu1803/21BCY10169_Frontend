import React, { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Grid, List, Filter, Share2, SortAsc } from 'lucide-react';

const statusColors = {
  All: { backgroundColor: '#e6f2ff', color: '#1e40af' },
  'Live/Registered': { backgroundColor: '#dcfce7', color: '#166534' },
  Pending: { backgroundColor: '#fef9c3', color: '#854d0e' },
  Abandoned: { backgroundColor: '#fee2e2', color: '#991b1b' },
  Others: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
};

export default function TrademarkSearch() {
  const [searchQuery, setSearchQuery] = useState('meta');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [trademarks, setTrademarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [lawFirms, setLawFirms] = useState([]);
  const [selectedLawFirm, setSelectedLawFirm] = useState('');
  const [attorneys, setAttorneys] = useState([]);
  const [selectedAttorney, setSelectedAttorney] = useState('');
  const [activeTab, setActiveTab] = useState('Owners');
  const [ownerSearchQuery, setOwnerSearchQuery] = useState('');
  const [lawFirmSearchQuery, setLawFirmSearchQuery] = useState('');
  const [attorneySearchQuery, setAttorneySearchQuery] = useState('');

  useEffect(() => {
    fetchTrademarks(searchQuery);
  }, []);

  const fetchTrademarks = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://vit-tm-task.api.trademarkia.app/api/v3/us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          input_query: query,
          input_query_type: "",
          sort_by: "default",
          status: [],
          exact_match: false,
          date_query: false,
          owners: [],
          attorneys: [],
          law_firms: [],
          mark_description_description: [],
          classes: [],
          page: 1,
          rows: 10,
          sort_order: "desc",
          states: [],
          counties: []
        }),
      });
      const data = await response.json();
      if (data.body && data.body.hits && data.body.hits.hits) {
        const fetchedTrademarks = data.body.hits.hits.map(hit => ({
          id: hit._id,
          name: hit._source.mark_identification,
          company: hit._source.current_owner,
          serialNumber: hit._id,
          filingDate: new Date(hit._source.filing_date * 1000).toLocaleDateString(),
          status: hit._source.status_type,
          statusDate: new Date(hit._source.status_date * 1000).toLocaleDateString(),
          description: hit._source.mark_description_description ? hit._source.mark_description_description.join(', ') : '',
          classes: hit._source.class_codes || [],
          owner: hit._source.current_owner,
          lawFirm: hit._source.law_firm,
          attorney: hit._source.attorney_name,
        }));
        setTrademarks(fetchedTrademarks);
        
        const uniqueOwners = [...new Set(fetchedTrademarks.map(tm => tm.owner).filter(Boolean))];
        const uniqueLawFirms = [...new Set(fetchedTrademarks.map(tm => tm.lawFirm).filter(Boolean))];
        const uniqueAttorneys = [...new Set(fetchedTrademarks.map(tm => tm.attorney).filter(Boolean))];
        
        setOwners(uniqueOwners);
        setLawFirms(uniqueLawFirms);
        setAttorneys(uniqueAttorneys);
      } else {
        setTrademarks([]);
        setOwners([]);
        setLawFirms([]);
        setAttorneys([]);
      }
    } catch (err) {
      setError('Failed to fetch trademarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrademarks(searchQuery);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTrademarks = [...trademarks].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredTrademarks = sortedTrademarks.filter(trademark => 
    (selectedStatus === 'All' || selectedStatus === 'Live/Registered' || trademark.status === selectedStatus) &&
    (selectedOwner === '' || trademark.owner === selectedOwner) &&
    (selectedLawFirm === '' || trademark.lawFirm === selectedLawFirm) &&
    (selectedAttorney === '' || trademark.attorney === selectedAttorney)
  );

  const filteredOwners = owners.filter(owner =>
    owner.toLowerCase().includes(ownerSearchQuery.toLowerCase())
  );

  const filteredLawFirms = lawFirms.filter(firm =>
    firm.toLowerCase().includes(lawFirmSearchQuery.toLowerCase())
  );

  const filteredAttorneys = attorneys.filter(attorney =>
    attorney.toLowerCase().includes(attorneySearchQuery.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#000000',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2563eb',
        }}>Trademark Search</h1>
        <form onSubmit={handleSearch} style={{
          marginRight: "350px",
        }}>
          <input
            type="text"
            placeholder="Search Trademark Here e.g. Mickey Mouse"
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 16px',
              width: '384px',
              marginRight: '8px',
              backgroundColor: '#ffffff',
              color: '#000000',
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            border: 'none',
          }}>
            Search
          </button>
        </form>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{
          display: 'flex',
          gap: '32px',
        }}>
          <div style={{ flexGrow: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <p style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '30px',
                }}>About {filteredTrademarks.length} Trademarks found for "{searchQuery}"</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px',
                }}>
                  <span style={{
                    fontWeight: '700',
                    fontSize: '16px',
                    lineHeight: '30px',
                    marginBottom: '16px',
                  }}>Also try searching for</span>
                  {searchQuery.split(' ').map((word, index) => (
                    searchQuery.split(' ').length - index >= 2 && (
                      <span key={index} style={{
                        display: 'inline-flex',
                        padding: '12px',
                        background: '#FEF7F0',
                        border: '1px solid #E7760E',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '12px',
                        lineHeight: '20px',
                        color: '#E7760E',
                      }}>
                        {searchQuery.split(' ').slice(index).join(' ')}
                      </span>
                    )
                  ))}
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  <Filter size={20} color="#000000" />
                </button>
                <button style={{
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  border: 'none',
                }}>
                  <Share2 size={20} color="#000000" />
                </button>
                <button style={{
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  border: 'none',
                }}>
                  <SortAsc size={20} color="#000000" />
                </button>
              </div>
            </div>

            {filteredTrademarks.length === 0 || (selectedStatus !== 'All' && selectedStatus !== 'Live/Registered') ? (
              <p style={{ textAlign: 'center', fontSize: '18px', color: '#6b7280', marginTop: '32px' }}>No results found</p>
            ) : viewMode === 'list' ? (
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '18px',
                      color: '#000000',
                    }} onClick={() => handleSort('name')}>
                      Mark
                      {sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '18px',
                      color: '#000000',
                    }} onClick={() => handleSort('company')}>
                      Details
                      {sortColumn === 'company' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '18px',
                      color: '#000000',
                    }} onClick={() => handleSort('status')}>
                      Status
                      {sortColumn === 'status' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '18px',
                      color: '#000000',
                    }}>
                      Class/Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrademarks.map((trademark) => (
                    <tr key={trademark.id} style={{ backgroundColor: '#f3f4f6' }}>
                      <td style={{
                        padding: '12px 20px',
                        verticalAlign: 'top',
                        width: '100px',
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e5e7eb',
                        }}>
                          <img src="/placeholder.svg?height=40&width=40" alt="Trademark icon" style={{ width: '40px', height: '40px' }} />
                        </div>
                      </td>
                      <td style={{
                        padding: '12px 20px',
                        verticalAlign: 'top',
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{trademark.name}</div>
                        <div style={{ fontWeight: '400', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{trademark.company}</div>
                        <div style={{ fontWeight: '400', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{trademark.serialNumber}</div>
                        <div style={{ fontWeight: '400', fontSize: '14px', color: '#6b7280' }}>{trademark.filingDate}</div>
                      </td>
                      <td style={{
                        padding: '12px 20px',
                        verticalAlign: 'top',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: statusColors[trademark.status]?.color || statusColors['Others'].color,
                            marginRight: '8px',
                          }}></span>
                          <span style={{ color: statusColors[trademark.status]?.color || statusColors['Others'].color, fontWeight: '600' }}>{trademark.status}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{trademark.statusDate}</div>
                      </td>
                      <td style={{
                        padding: '12px 20px',
                        verticalAlign: 'top',
                      }}>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px',
                        }}>
                          {trademark.description}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {trademark.classes.map((cls, index) => (
                            <span key={index} style={{
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '16px',
                              padding: '4px 12px',
                              fontSize: '12px',
                              color: '#374151',
                            }}>
                              Class {cls}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {filteredTrademarks.map((trademark) => (
                  <div key={trademark.id} style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e5e7eb',
                        marginRight: '12px',
                      }}>
                        <img src="/placeholder.svg?height=30&width=30" alt="Trademark icon" style={{ width: '30px', height: '30px' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '16px' }}>{trademark.name}</div>
                        <div style={{ fontWeight: '400', fontSize: '14px', color: '#6b7280' }}>{trademark.company}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: statusColors[trademark.status]?.backgroundColor || statusColors['Others'].backgroundColor,
                        color: statusColors[trademark.status]?.color || statusColors['Others'].color,
                        borderRadius: '16px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: statusColors[trademark.status]?.color || statusColors['Others'].color,
                          marginRight: '8px',
                        }}></span>
                        {trademark.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{trademark.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {trademark.classes.map((cls, index) => (
                        <span key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '16px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          color: '#374151',
                        }}>
                          Class {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isFilterVisible && (
            <div style={{ width: '256px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#000000' }}>Status</h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {Object.keys(statusColors).map((status) => (
                    <button
                      key={status}
                      style={{
                        ...statusColors[status],
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: selectedStatus === status ? 1 : 0.6,
                      }}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status === 'Live/Registered' && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginRight: '4px' }}></span>}
                      {status === 'Pending' && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', marginRight: '4px' }}></span>}
                      {status === 'Abandoned' && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '4px' }}></span>}
                      {status === 'Others' && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6', marginRight: '4px' }}></span>}
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#000000' }}>Display</h3>
                <div style={{
                  display: 'flex',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: viewMode === 'grid' ? '#3b82f6' : '#ffffff',
                      color: viewMode === 'grid' ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                    }}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} style={{ display: 'inline-block', marginRight: '4px' }} />
                    Grid View
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: viewMode === 'list' ? '#3b82f6' : '#ffffff',
                      color: viewMode === 'list' ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                    }}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} style={{ display: 'inline-block', marginRight: '4px' }} />
                    List View
                  </button>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '16px',
                }}>
                  {['Owners', 'Law Firms', 'Attorneys'].map((tab) => (
                    <button
                      key={tab}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: 'transparent',
                        color: activeTab === tab ? '#3b82f6' : '#374151',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div style={{
                  position: 'relative',
                  marginBottom: '16px',
                }}>
                  <Search size={20} style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}`}
                    value={
                      activeTab === 'Owners' ? ownerSearchQuery :
                      activeTab === 'Law Firms' ? lawFirmSearchQuery :
                      attorneySearchQuery
                    }
                    onChange={(e) => {
                      if (activeTab === 'Owners') setOwnerSearchQuery(e.target.value);
                      else if (activeTab === 'Law Firms') setLawFirmSearchQuery(e.target.value);
                      else setAttorneySearchQuery(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 8px 8px 36px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {activeTab === 'Owners' && filteredOwners.map((owner, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedOwner === owner}
                        onChange={() => setSelectedOwner(selectedOwner === owner ? '' : owner)}
                        style={{ marginRight: '8px' }}
                      />
                      {owner}
                    </label>
                  ))}
                  {activeTab === 'Law Firms' && filteredLawFirms.map((firm, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedLawFirm === firm}
                        onChange={() => setSelectedLawFirm(selectedLawFirm === firm ? '' : firm)}
                        style={{ marginRight: '8px' }}
                      />
                      {firm}
                    </label>
                  ))}
                  {activeTab === 'Attorneys' && filteredAttorneys.map((attorney, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedAttorney === attorney}
                        onChange={() => setSelectedAttorney(selectedAttorney === attorney ? '' : attorney)}
                        style={{ marginRight: '8px' }}
                      />
                      {attorney}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}