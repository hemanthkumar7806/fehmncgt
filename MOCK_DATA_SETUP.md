# Mock Data Development Setup

This guide explains how to enable mock data mode for development and testing purposes.

## Overview

The application now supports a development flag that allows you to use mock data instead of making actual API calls. This is useful for:

- **Development**: Working without needing live API connections
- **Testing**: Consistent, predictable data for testing
- **Offline Development**: Working without internet connectivity
- **Demo Purposes**: Showing functionality with reliable sample data

## How to Enable Mock Data

### Method 1: Environment Variable (Recommended)

Add the following line to your `.env.local` file:

```bash
# Set to 'true' to use mock data instead of fetching from APIs
NEXT_PUBLIC_USE_MOCK_DATA=true
```

To disable mock data and use real APIs:
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Method 2: Automatic Development Mode

By default, mock data can be automatically enabled in development mode. The configuration checks:
1. If `NEXT_PUBLIC_USE_MOCK_DATA=true` → Always use mock data
2. If `NEXT_PUBLIC_USE_MOCK_DATA=false` → Never use mock data  
3. If not set → Use mock data only in development environment

## What Gets Mocked

When mock data mode is enabled, the following API calls are replaced with mock data:

### 🩺 Doctors API
- **GET /api/doctors** → Returns 6 sample doctors with complete profiles
- **Doctor profiles include**: Names, titles, credentials, specialties, experience, photos, contact info

### 📅 Appointments API  
- **GET /api/doctors/available-dates** → Returns sample available dates for appointments
- **GET /api/doctors/slots** → Returns sample time slots for appointments
- **POST booking endpoints** → Simulates successful appointment booking

### ⚡ Performance
- **Simulated delays**: 300-800ms delays to mimic real API response times
- **Loading states**: All loading indicators work normally
- **Error handling**: Mock APIs can still simulate errors if needed

## Mock Data Details

### Sample Doctors
The mock data includes 6 specialists:
- Dr. Sarah Johnson (Interventional Radiologist)
- Dr. Michael Chen (Gynecologist) 
- Dr. Emily Rodriguez (Reproductive Endocrinologist)
- Dr. David Williams (Interventional Radiologist)
- Dr. Lisa Thompson (Gynecologic Surgeon)
- Dr. Robert Martinez (Interventional Radiologist)

### Sample Time Slots
- Morning slots: 8:30 AM - 12:00 PM
- Afternoon slots: 2:00 PM - 5:00 PM
- Mix of consultation and follow-up appointment types
- Some slots marked as unavailable for realistic testing
- Dynamic dates: Tomorrow, day after tomorrow, 3 days, 5 days, and 1 week from current date

### Sample Available Dates
- **5 different dates** starting from tomorrow
- **Varying slot counts**: 4-10 available slots per date
- **Realistic scheduling**: Some dates busier than others
- **Pre-loaded slots**: Each date comes with its own time slots
- **Mixed availability**: Some time slots are unavailable to simulate real-world scenarios

## Development Logging

When mock data is enabled, you'll see helpful console logs:

```
[DEV] Using mock doctors data
[DEV] Successfully loaded 6 doctors { mockMode: true, count: 6 }
[DEV] Using mock available dates data { providerId: "...", noOfDays: 7 }
[DEV] Using mock time slots data { providerId: "...", locationId: "..." }
[DEV] Mock booking appointment: { doctorId: "...", date: "...", time: "..." }
```

## File Structure

```
src/
├── config/
│   └── development.ts          # Development configuration and flags
├── data/
│   └── mockDoctors.ts         # Mock data definitions
├── services/
│   └── doctorsApi.ts          # API service with mock data integration
└── hooks/
    └── useDoctors.ts          # Hooks with development logging
```

## Integration Points

The mock data system integrates with:

- ✅ **Experts Component**: Displays mock doctors seamlessly
- ✅ **Appointment Modal**: Works with mock booking
- ✅ **Loading States**: All loading animations work
- ✅ **Error Handling**: Error states still function
- ✅ **React Hooks**: `useDoctors` and `useDoctor` support mock mode

## Switching Between Modes

You can easily switch between mock and real data:

1. **During Development**: Set environment variable and restart dev server
2. **For Testing**: Temporarily enable in test environment
3. **For Production**: Ensure `NEXT_PUBLIC_USE_MOCK_DATA=false` or remove the variable

## Troubleshooting

### Mock Data Not Loading
1. Check `.env.local` has `NEXT_PUBLIC_USE_MOCK_DATA=true`
2. Restart the development server after changing environment variables
3. Check browser console for `[DEV]` log messages

### Still Seeing API Calls
1. Verify environment variable is set correctly
2. Check that you're in development mode (`NODE_ENV=development`)
3. Look for error messages in console

### Build Issues
1. Mock data only affects runtime, not build process
2. Make sure all TypeScript interfaces match between mock and real data
3. Run `npm run build` to verify no type errors

## Best Practices

1. **Keep Mock Data Updated**: Update mock data when API schemas change
2. **Test Both Modes**: Test with both mock and real data before deploying  
3. **Environment Specific**: Use different settings for dev/staging/production
4. **Realistic Data**: Keep mock data realistic and representative of actual use cases

## Commands

```bash
# Enable mock data
echo "NEXT_PUBLIC_USE_MOCK_DATA=true" >> .env.local

# Disable mock data  
echo "NEXT_PUBLIC_USE_MOCK_DATA=false" >> .env.local

# Start development server
npm run dev

# Check current configuration
# Look for [DEV] logs in browser console
```
