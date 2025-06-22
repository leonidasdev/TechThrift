import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../../components/Search/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSearch.mockClear();
  });

  it('renders search input correctly', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        placeholder="Test placeholder"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });

  it('calls onChange when input value changes', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockOnChange).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch when form is submitted', () => {
    render(
      <SearchBar
        value="test query"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form!);

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('shows clear button when value is not empty', () => {
    render(
      <SearchBar
        value="test"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const clearButton = screen.getByLabelText('Limpiar búsqueda');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(
      <SearchBar
        value="test"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const clearButton = screen.getByLabelText('Limpiar búsqueda');
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('handles keyboard navigation correctly', async () => {
    render(
      <SearchBar
        value="test"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Focus input to show suggestions
    fireEvent.focus(input);
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should call onSearch with selected suggestion
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});